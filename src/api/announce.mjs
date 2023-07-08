import { randomBytes } from "crypto";

const database = global.database;

export const GET = async (req, res) => {
  try {
    if (!req.query.id) {
      res.status(400);
      res.send();
    } else {
      const announcementData = await database.runQuery(
        "SELECT ip FROM announced WHERE timestamp > NOW() AND id = ?",
        [req.query.id]
      );

      res.status(200);
      res.json(announcementData);
    }
  } catch (err) {
    console.log(err);

    res.status(500);
    res.send();
  }
};

export const POST = async (req, res) => {
  try {
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    let token;
    let reqTimestamp = Number(Date.now()) + 5 * 60 * 1000;

    randomBytes(64, (err, buffer) => {
      token = buffer.toString("hex");
    });

    await database.runQuery(
      "INSERT INTO announced (ip, timestamp) VALUES (?,?) ON DUPLICATE KEY UPDATE timestamp = VALUES(timestamp)",
      [String(ip), new Date(reqTimestamp)]
    );

    const insertedRecord = await database.runQuery(
      "SELECT id FROM announced WHERE ip = ? LIMIT 1",
      [String(ip)]
    );

    res.status(200);
    res.json({
      id: String(insertedRecord[0].id),
      token: String(token).toUpperCase(),
    });
  } catch (err) {
    console.log(err);

    res.status(500);
    res.send();
  }
};
