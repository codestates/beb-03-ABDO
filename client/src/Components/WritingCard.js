import React from "react";
import styled from "styled-components";

// 글쓴이 닉네임

const WriterNickname = styled.div`

    display:flex ;
    justify-content:center ;
    align-items:center ;

    padding-left: 10px;
    padding-right: 20px;

    font-size: 35px;
    font-weight: 600;

    /* background-color: gray; */

`


// 글쓴이 아이디
const WriterId = styled.div`
    display: flex;
    justify-content:center ;
    align-items: center;

    font-size: 22px;
    /* background-color: yellow; */

`
// 글쓴이 닉네임
const WriterProfileCard = styled.div`
    display: flex;
    position:relative;
    top:10px;
    left:10px;
    width: 800px;
    height: 50px;
    /* background-color: red; */
    overflow:hidden;
`

// 글쓴이 아이디 닉네임을 포함하는 카드
const WriterProfileCardArea = styled.div`

    left: 10px ;
    width: 100%;
    height: 50px;
    /* background-color: lightgray; */
`
//--------------------------------------------------------------- ^ 글쓴이 정보

const Topic = styled.div`
    font-size: 60px;
`


// 글 제목영역
const TopicArea = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 70px;
    /* background-color:blue ; */
`
//----------------------------------------------------------------^ 글 제목 영역

const Text = styled.div`
    margin-top: 20px;
    margin-bottom:20px ;


    justify-content:center ;
    align-items:center ;

    font-size: 30px;
    text-align: center;
    /* background-color:white ; */
`

// 글
const WritingTextArea = styled.div`
    display:flex ;
    justify-content:center ;
    align-items:center ;

    width: 100%;
    height: 330px;

    font-weight:600 ;
    color:rgb(90,90,90);
    /* background-color:green ; */
`

//---------------------------------------------------------------^ 글 내용

//좋아요 부분
const LikeArea = styled.div`

    display:flex ;
    justify-content: flex-end;

    width:100% ;
    height: 50px;

    /* background-color: rosybrown; */
`

//좋아요 아이콘
const LikeIconArea = styled.div`
    position:relative ;

    top:-70px;
    left:-30px;

    width:200px ;
    height:100px ;

    /* background-color: skyblue; */

`
const LikeIcon = styled.img.attrs({
    src:'/Resource/ICO/ICO_InkTokenIcon.png'
})`
    width: 100px;
    height:100px;
    /* background-color:white ; */
    &:hover{
        /* box-shadow:0 0 14px rgb(225,205,204) ; */
        /* -webkit-filter: drop-shadow(5px 5px 5px #222); */
        filter: drop-shadow(0px 0px 5px #222);
    }
`


// 좋아요 숫자
const LikeValue = styled.div`

    position:relative ;
    display:flex ;

    justify-content:center ;
    align-items: center;

    font-size: 30px;
    font-weight: 600;

    top:-85px;
    left:100px ;
    height:80px;
    width : 100px;

    /* background-color: salmon; */
`



// 모든 컴포넌트 포함
const WritingCardArea = styled.div`
display: flex;
flex-direction:column ;

box-shadow: 0px 0px 14px rgb(225,208,205) ;
margin: 20px;
width: 1400px;
height: 500px;

/* background-color: white; */
`



const WritingCard = ({topic,nickName,userId,text,likes,writingsId,plzAddLike})=>{

    let textCopy = [...text];
    let changedText;

    // 글 띄어쓰기
    if(textCopy!=undefined){
        let textRow = '';
        let textArr=[];

        for(let i=0; i < textCopy.length ; i++){
            if(text[i] =='-'){
                if(textRow.length !==0){
                    textArr.push(textRow);
                    textRow =''
                }
            }
            else{
                textRow+=textCopy[i];
            }
        }
        if(textRow.length > 0){textArr.push(textRow); textRow=''};
        changedText=textArr;
    }

    // 좋아요
    function addLike(){
        console.log("좋아요");
        plzAddLike(writingsId); // 이 글이 좋아요가 표시되었어요!
    }
    

    return(
        <WritingCardArea>
            <WriterProfileCardArea>
                <WriterProfileCard>
                    <WriterNickname>{nickName || '무명'}</WriterNickname>
                    <WriterId>[ {userId ||'없는아이디'} ]</WriterId>
                </WriterProfileCard>
            </WriterProfileCardArea>
            <TopicArea>
                <Topic>{topic || '무제'}</Topic>
            </TopicArea>
            <WritingTextArea>
                <Text>
                    {changedText.map((row,idx)=>{return <div  key={`row${idx}`} style={{padding:"5px"}}>{row}</div>}) || '내용없음'}
                </Text>
            </WritingTextArea>
            <LikeArea>
                <LikeIconArea>
                    <LikeIcon onClick={addLike}></LikeIcon>
                    <LikeValue>{likes? likes.length : 0}</LikeValue>
                </LikeIconArea>
            </LikeArea>
        </WritingCardArea>
    )
}

export default WritingCard