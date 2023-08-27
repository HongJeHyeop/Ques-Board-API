# Ques-Board-API

## MySQL DB구성
<img src="https://github.com/HongJeHyeop/Ques-Board-API/assets/121603065/7fe8e5a6-7595-4ea4-ac61-67e0e5ea234a"/>
<br/>
<br/>

## 게시글 전체 조회 
> ### Request
> - url      : http://[host]:4000/posts
> - method   : GET
> - response : JSON[] (no, title, contents, writeDate)
<br/>

## 게시글 단일 조회 
> ### Request
> - url      : http://[host]:4000/post/[no]
> - method   : GET
> - response : JSON (no, title, contents, writeDate)
<br/>

## 게시글 작성 
> ### Request
> - url      : http://[host]:4000/post
> - method   : POST
> - body     : JSON (title, contents) _* 한글기준 최대글자 수 : title(25), contents(2000)_
> - response : JSON (no, result)
<br/>

## 게시글 삭제 
> ### Request
> - url      : http://[host]:4000/post/[no]
> - method   : DELETE
> - response : JSON (result, message)
<br/>

## 제목으로 게시글 검색 
> ### Request
> - url      : http://[host]:4000/search/title
> - method   : GET
> - body     : JSON (title) _* 제목에 포함된 검색어_
> - response : JSON (data:json[], count)
<br/>

## 내용으로 게시글 검색 
> ### Request
> - url      : http://[host]:4000/search/contents
> - method   : GET
> - body     : JSON (contents) _* 내용에 포함된 검색어_
> - response : JSON (data:json[], count)
<br/>

## 작성일시(기간)으로 게시글 검색 
> ### Request
> - url      : http://[host]:4000/search/date
> - method   : GET
> - body     : JSON (startDateTime, endDateTime)
>   - 사용가능한 날짜형식 : YYYY-MM-DD hh:mm, YYYY-MM-DD hh, YYYY-MM-DD
> - response : JSON (data:json[], count)
