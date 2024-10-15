const postgre = require('../database');

const bookController = {
    getAll: async (req, res) => {
        try {
            const { rows } = await postgre.query("SELECT * FROM games");
            res.json({ msg: "สำเร็จ", data: rows });
        } catch (error) {
            res.status(500).json({ msg: "เกิดข้อผิดพลาดในการดึงข้อมูลเกมส์", error: error.message });
        }
    },
    
    getById: async (req, res) => {
        try {
            const { rows } = await postgre.query("SELECT * FROM games WHERE game_id = $1", [req.params.id]);

            if (rows[0]) {
                return res.json({ msg: "สำเร็จ", data: rows[0] });
            }

            res.status(404).json({ msg: "ไม่พบเกมส์" });
        } catch (error) {
            res.status(500).json({ msg: "เกิดข้อผิดพลาดในการดึงข้อมูลเกมส์", error: error.message });
        }
    },
    
    create: async (req, res) => {
        try {
            const { game_name, creator_name, price } = req.body;

            // ตรวจสอบข้อมูลที่จำเป็น
            if (!game_name || !creator_name || typeof price !== 'number') {
                return res.status(400).json({ msg: "ชื่อเกม, ผู้สร้าง, และราคาเป็นข้อมูลที่จำเป็น" });
            }

            // เตรียมคำสั่ง SQL
            const sql = 'INSERT INTO games(game_name, creator_name, price) VALUES($1, $2, $3) RETURNING *';
            const { rows } = await postgre.query(sql, [game_name, creator_name, price]);

            res.status(201).json({ msg: "สำเร็จ", data: rows[0] });
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการสร้างเกมส์:", error);
            res.status(500).json({ msg: "เกิดข้อผิดพลาดในการสร้างเกมส์", error: error.message });
        }
    },
    
    updateById: async (req, res) => {
        try {
            const { game_name, creator_name, price } = req.body;

            if (!game_name && !creator_name && typeof price !== 'number') {
                return res.status(400).json({ msg: "ต้องมีข้อมูลอย่างน้อยหนึ่งรายการ (ชื่อเกม, ผู้สร้าง, ราคา) เพื่ออัปเดต" });
            }

            const sql = 'UPDATE games SET game_name = COALESCE($1, game_name), creator_name = COALESCE($2, creator_name), price = COALESCE($3, price) WHERE game_id = $4 RETURNING *';
            const { rows } = await postgre.query(sql, [game_name, creator_name, price, req.params.id]);

            if (rows[0]) {
                return res.json({ msg: "สำเร็จ", data: rows[0] });
            }

            res.status(404).json({ msg: "ไม่พบเกมส์" });
        } catch (error) {
            res.status(500).json({ msg: "เกิดข้อผิดพลาดในการอัปเดตเกมส์", error: error.message });
        }
    },
    
    deleteById: async (req, res) => {
        try {
            const sql = 'DELETE FROM games WHERE game_id = $1 RETURNING *';
            const { rows } = await postgre.query(sql, [req.params.id]);

            if (rows[0]) {
                return res.json({ msg: "สำเร็จ", data: rows[0] });
            }

            return res.status(404).json({ msg: "ไม่พบเกมส์" });
        } catch (error) {
            res.status(500).json({ msg: "เกิดข้อผิดพลาดในการลบเกมส์", error: error.message });
        }
    }
}

module.exports = bookController;
