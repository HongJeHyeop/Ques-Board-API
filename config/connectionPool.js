const mysql = require('mysql2');

// .env에 저장되어있는 mysql정보를 가지고 와서 pool 생성
const pool = mysql.createPool({
    host    : process.env.MYSQL_HOST,
    port    : process.env.MYSQL_PORT,
    user    : process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
    charset : process.env.MYSQL_CHARSET
})

module.exports = (callback) => {
    // 커넥션 획득
    pool.getConnection((err, conn) => {
        if (err) { // 연결 실패시 에러 코드와 메세지 출력
            console.error('MySQL Connection Failed');
            console.error(`Error Code : ${err.code}`);
            console.error(`Error Message : ${err.message}`);
        } else { // 연결 성공시 성공 로그출력과 콜백함수로 커넥션 전달
            console.log('MySQL Connection Successful!');
            callback(conn);
        }
    })
};