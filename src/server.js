"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const connectionPool_1 = require("./config/connectionPool");
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "4000");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/search', require('./routes/search'));
app.get('/', (req, res) => {
    console.log('=== Ques Board API 접속 ===');
    res.send('Success!');
});
// 전체 게시글 조회
app.get('/posts', (req, res) => {
    // 커넥션 풀 생성
    (0, connectionPool_1.pool)((conn) => {
        const sql = "SELECT * FROM board_tbl";
        // 쿼리 실행
        conn.query(sql, (err, data) => {
            if (err) {
                resError('[GET /posts]', res, err);
            }
            else {
                console.log(`[GET /posts] 게시글 조회 결과 : ${data.length}`);
                res.send({
                    data: data,
                    count: data.length
                });
            }
        });
        // 커넥션 반납
        conn.release();
    });
});
// 단일 게시글 조회
app.get('/post/:no', (req, res) => {
    // 커넥션 풀 생성
    (0, connectionPool_1.pool)((conn) => {
        const no = req.params.no; // 게시글 번호 가져오기
        const sql = "SELECT * FROM board_tbl WHERE no = ?";
        // 쿼리 실행
        conn.query(sql, no, (err, data) => {
            if (err) {
                resError('[GET /post/:no]', res, err);
            }
            else { // 쿼리 실행이 성공한 경우 데이터 전달
                console.log(`[GET /post/:no] 게시글 조회 결과 : ${data.length}`);
                res.send(data[0]);
            }
        });
        // 커넥션 반납
        conn.release();
    });
});
// 게시글 작성
app.post('/post', (req, res) => {
    const { title, contents } = req.body;
    // 커넥션 플 생성
    (0, connectionPool_1.pool)((conn) => {
        const sql = "INSERT INTO board_tbl VALUES (DEFAULT, ?, ?, DEFAULT)";
        // 쿼리 실행
        conn.query(sql, [title, contents], (err, data) => {
            if (err) {
                resError('[POST /post]', res, err);
            }
            else { // 쿼리 실행이 성공한 경우
                console.log(`[POST /post] 게시글 작성 결과 : ${data.affectedRows}`);
                console.log(`[POST /post] 작성된 게시글 번호 : ${data.insertId}`);
                res.send({
                    no: data.insertId,
                    result: true
                });
            }
        });
        // 커넥션 반납
        conn.release();
    });
});
// 게시글 삭제
app.delete('/post/:no', (req, res) => {
    const no = req.params.no;
    console.log(`[DELETE /post] 삭제할 게시글 번호 : ${no}`);
    // 커넥션 풀 생성
    (0, connectionPool_1.pool)((conn) => {
        const sql = "DELETE FROM board_tbl WHERE no = ?";
        conn.query(sql, no, (err, result) => {
            if (err) {
                resError('[DELETE /post]', res, err);
            }
            else { // 쿼리 실행이 성공한 경우
                console.log(`[DELETE /post] 게시글 삭제 결과 : ${result.affectedRows}`);
                result.affectedRows > 0 // 영향을 받은 쿼리가 있는지 검사
                    ? res.send({
                        result: true,
                        message: '게시글이 성공적으로 삭제되었습니다'
                    })
                    : res.status(404).send({
                        result: false,
                        message: '삭제할 게시글이 존재하지 않습니다'
                    });
            }
        });
        // 커넥션 반납
        conn.release();
    });
});
// 지정된 경로 이외의 요청 처리
app.use(function (req, res) {
    res.status(404).send('요청하신 경로를 찾을수 없습니다.');
});
// 에러 응답 메세드
const resError = (path, res, err) => {
    // 에러 코드와 메세지 출력
    console.error(`${path} Error Code : ${err.code}`);
    console.error(`${path} Error Message : ${err.message}`);
    res.status(400).send({
        code: err.code,
        message: err.message,
        result: false
    });
};
// 해당 포트로 서버 실행
app.listen(PORT, () => {
    console.log(`Ques Board Server On : http://localhost:${PORT}`);
});
