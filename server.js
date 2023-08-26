require('dotenv').config();

const express = require('express');
const app = express();
const pool = require('./config/connectionPool');
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    console.log('=== Ques Board API 접속 ===');
    res.send('Success!');
})

// 전체 게시글 조회
app.get('/posts', (req, res) => {
    // 커넥션 풀 생성
    pool((conn) => {
        const sql = "SELECT * FROM board_tbl";

        // 쿼리 실행
        conn.query(sql, (err, data) => {
            if (err) {
                console.error(`Error Code : ${err.code}`);
                console.error(`Error Message : ${err.message}`);
            } else {
                console.log(data);
                res.json(data);
            }
        })
        // 커넥션 반납
        conn.release();
    })
})

// 단일 게시글 조회
app.get('/post/:no', (req, res) => {
    // 커넥션 풀 생성
    pool((conn) => {
        const no = req.params.no; // 게시글 번호 가져오기
        const sql = "SELECT * FROM board_tbl WHERE no = ?";

        // 쿼리 실행
        conn.query(sql, no, (err, data) => {
            if (err) { // 쿼리 실행이 실패한 경우 에러 코드와 메세지 출력
                console.error(`Error Code : ${err.code}`);
                console.error(`Error Message : ${err.message}`);
            } else { // 쿼리 실행이 성공한 경우 데이터 전달
                data[0] === undefined
                    ? res.send('해당하는 게시글이 존재하지 않습니다.')  // 쿼리 실행은 성공하였으나 해당하는 데이터가 없는 경우
                    : res.send(data[0]);
            }
        })

        // 커넥션 반납
        conn.release();
    })
})

// 게시글 작성
app.post('/post', (req, res) => {
    const {title, contents} = req?.body;

    // 커넥션 플 생성
    pool((conn) => {
        const sql = "INSERT INTO board_tbl VALUES (DEFAULT, ?, ?, DEFAULT)";

        // 쿼리 실행
        conn.query(sql, [title, contents], (err, data) => {
            if (err) { // 쿼리 실행이 실패한 경우 에러 코드와 메세지 출력
                console.error(`Error Code : ${err.code}`);
                console.error(`Error Message : ${err.message}`);
                res.send({ // 에러 코드 및 메세지, 결과 전송
                    code   : err.code,
                    message: err.message,
                    result : false
                })
            } else {// 쿼리 실행이 성공한 경우
                console.log(data)
                res.send({ // 작성한 게시글 번호 및 결과 전송
                    no    : data.insertId,
                    result: true
                })
            }
        })

        // 커넥션 반납
        conn.release();
    })
})

// 게시글 삭제
app.delete('/post', (req, res) => {
    const no = req.body?.no;
    console.log('삭제할 게시글 번호 : ' + no);

    // 커넥션 풀 생성
    pool((conn) => {
        const sql = "DELETE FROM board_tbl WHERE no = ?";
        conn.query(sql, no, (err, result) => {
            if (err) { // 쿼리 실행이 실패한 경우 에러 코드와 메세지 출력
                console.error(`Error Code : ${err.code}`);
                console.error(`Error Message : ${err.message}`);
                res.status(400).send({ // 에러 코드 및 메세지, 결과 전송
                    code   : err.code,
                    message: err.message,
                    result : false
                })
            } else {// 쿼리 실행이 성공한 경우
                console.log(result)
                result.affectedRows > 0 // 영향을 받은 쿼리가 있는지 검사
                    ? res.status(200).send({ // 있다면 성공 메세지 전달
                        result: true,
                        message: '게시글이 성공적으로 삭제되었습니다'
                    })
                    : res.status(404).send({ // 없다면 실패 메세지 전달
                        result: false,
                        message: '삭제할 데이터가 존재하지 않습니다'
                    })
            }
        })
    })
})


// 해당 포트로 서버 실행
app.listen(PORT, () => {
    console.log(`Ques Board Server On : http://localhost:${PORT}`);
})