require('dotenv').config();

import { QueryError } from "mysql2";
import express, { Request, Response } from 'express';
import { pool } from './config/connectionPool';

const app = express();
const PORT: number  = parseInt(process.env.PORT || "4000") ;

type error = QueryError | null;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/search', require('./routes/search'));

app.get('/', (req: Request, res: Response) => {
    console.log('=== Ques Board API 접속 ===');
    res.send('Success!');

})

// 전체 게시글 조회
app.get('/posts', (req: Request, res: Response) => {
    // 커넥션 풀 생성
    pool((conn) => {
        const sql: string = "SELECT * FROM board_tbl";

        // 쿼리 실행
        conn.query(sql, (err: error, data: any) => {
            if (err) {
                resError('[GET /posts]', res, err);
            } else {
                console.log(`[GET /posts] 게시글 조회 결과 : ${data.length}`);
                res.send({
                    data : data,
                    count: data.length
                });
            }
        })
        // 커넥션 반납
        conn.release();
    })
})

// 단일 게시글 조회
app.get('/post/:no', (req: Request, res: Response) => {
    // 커넥션 풀 생성
    pool((conn) => {
        const no: string = req.params.no; // 게시글 번호 가져오기
        const sql: string = "SELECT * FROM board_tbl WHERE no = ?";

        // 쿼리 실행
        conn.query(sql, no, (err: error, data: any) => {
            if (err) {
                resError('[GET /post/:no]', res, err);
            } else { // 쿼리 실행이 성공한 경우 데이터 전달
                console.log(`[GET /post/:no] 게시글 조회 결과 : ${data.length}`);
                res.send(data[0]);
            }
        })

        // 커넥션 반납
        conn.release();
    })
})

// 게시글 작성
app.post('/post', (req: Request, res: Response) => {
    const { title, contents }: { title: string, contents: string } = req.body;

    // 커넥션 플 생성
    pool((conn) => {
        const sql: string = "INSERT INTO board_tbl VALUES (DEFAULT, ?, ?, DEFAULT)";

        // 쿼리 실행
        conn.query(sql, [title, contents], (err: error, data: any) => {
            if (err) {
                resError('[POST /post]', res, err);
            } else {// 쿼리 실행이 성공한 경우
                console.log(`[POST /post] 게시글 작성 결과 : ${data.affectedRows}`);
                console.log(`[POST /post] 작성된 게시글 번호 : ${data.insertId}`);
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
app.delete('/post/:no', (req: Request, res: Response) => {
    const no: string = req.params.no;
    console.log(`[DELETE /post] 삭제할 게시글 번호 : ${no}`);

    // 커넥션 풀 생성
    pool((conn) => {
        const sql: string = "DELETE FROM board_tbl WHERE no = ?";
        conn.query(sql, no, (err: error , result: any): void => {
            if (err) {
                resError('[DELETE /post]', res, err);
            } else {// 쿼리 실행이 성공한 경우
                console.log(`[DELETE /post] 게시글 삭제 결과 : ${result.affectedRows}`);
                result.affectedRows > 0 // 영향을 받은 쿼리가 있는지 검사
                    ? res.send({ // 있다면 성공 메세지 전달
                        result: true,
                        message: '게시글이 성공적으로 삭제되었습니다'
                    })
                    : res.status(404).send({ // 없다면 실패 메세지 전달
                        result: false,
                        message: '삭제할 게시글이 존재하지 않습니다'
                    })
            }
        })

        // 커넥션 반납
        conn.release();
    })
})

// 지정된 경로 이외의 요청 처리
app.use(function(req: Request, res: Response) {
    res.status(404).send('요청하신 경로를 찾을수 없습니다.');
});

// 에러 응답 메세드
const resError = (path: string, res: Response, err: QueryError): void => {
    // 에러 코드와 메세지 출력
    console.error(`${path} Error Code : ${err.code}`);
    console.error(`${path} Error Message : ${err.message}`);
    res.status(400).send({ // 에러 코드 및 메세지, 결과 전송
        code   : err.code,
        message: err.message,
        result : false
    })
}

// 해당 포트로 서버 실행
app.listen(PORT, (): void => {
    console.log(`Ques Board Server On : http://localhost:${PORT}`);
})