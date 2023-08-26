const express = require('express');
const pool = require('../config/connectionPool');
const router = express.Router();


// 제목으로 게시글 검색
router.get('/title', (req, res) => {
    const title = req.body?.title;

    pool((conn) => {
        const sql = "SELECT * FROM board_tbl WHERE title LIKE CONCAT ('%', ?, '%')"; // 제목에 검색어가 포함되어 있는 게시물 찾기
        conn.query(sql, title, (err, data) => {
            if (err) { // 쿼리 실행이 실패한 경우 에러 코드와 메세지 출력
                console.error(`Error Code : ${err.code}`);
                console.error(`Error Message : ${err.message}`);
                res.status(400).send({ // 에러 코드 및 메세지, 결과 전송
                    code   : err.code,
                    message: err.message,
                    result : false
                })
            } else {// 쿼리 실행성공, 데이터 전송
                console.log(data)
                res.status(200).send({
                    data : data, // 찾은 게시물
                    count: data.length // 찾은 게시글 개수
                })
            }
        })

        // 커넥션 반납
        conn.release();
    })
})

// 내용으로 게시글 검색
router.get('/contents', (req, res) => {
    const contents = req.body?.contents;

    pool((conn) => {
        const sql = "SELECT * FROM board_tbl WHERE contents LIKE CONCAT ('%', ?, '%')"; // 내용에 검색어가 포함되어 있는 게시물 찾기
        conn.query(sql, contents, (err, data) => {
            if (err) { // 쿼리 실행이 실패한 경우 에러 코드와 메세지 출력
                console.error(`Error Code : ${err.code}`);
                console.error(`Error Message : ${err.message}`);
                res.status(400).send({ // 에러 코드 및 메세지, 결과 전송
                    code   : err.code,
                    message: err.message,
                    result : false
                })
            } else {// 쿼리 실행성공, 데이터 전송
                console.log(data)
                res.status(200).send({
                    data : data, // 찾은 게시물
                    count: data.length // 찾은 게시글 개수
                })
            }

            // 커넥션 반납
            conn.release();
        })
    })
})



module.exports = router;