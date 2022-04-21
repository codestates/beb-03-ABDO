import Writing from "../models/writing.js";
import Account from "../models/account.js";
import mongoose from "mongoose";

/*
  작성한 글을 db에 저장
*/
export const postWriting = async (req, res) => {
  const { title, content, nickname } = req.body;
  // req.body에 필요한 값들이 없으면 400 에러 응답
  if (!title || !content || !nickname) {
    return res.status(400).json({
      status: "fail",
      message: "Title, content or nickname is missing",
    });
  }

  // 해당 닉네임을 가진 유저의 db id를 가져옴
  const { _id } = await Account.findOne({ nickname });

  const newWriting = new Writing({
    title,
    content,
    nickname,
    writer: _id,
    comments: [],
    likes: [],
  });

  try {
    // db에 저장
    const { _id } = await newWriting.save();

    // 저장 후 토큰 지급

    res.status(201).json({ status: "success", data: { writingId: _id } });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/*
  Writing ID를 받아서 해당 writing에 대한 정보를 응답
*/
export const getWritingById = async (req, res) => {
  const id = req.params.id;

  //전달받은 id를 가진 writing을 찾아옴
  const data = await Writing.findById(id);

  //해당 id를 가진 writing 없으면 에러 응답
  if (!data) {
    return res.status(400).json({
      status: "fail",
      message: `Writing ID: ${id} does not exist!`,
    });
  }

  const { _id, title, content, writer, comments, likes, createdAt } = data;

  const { userId, nickname } = await Account.findById(writer);
  const newLikes = await Promise.all(
    likes.map(async (id) => {
      const { userId } = await Account.findById(id);
      return userId;
    })
  );
  const newComments = await Promise.all(
    comments.map(async (el) => {
      const { userId, nickname } = await Account.findById(el.userId);
      return {
        userId,
        nickname,
        comment: el.comment,
      };
    })
  );
  res.status(200).json({
    status: "success",
    data: {
      id: _id,
      title,
      content,
      writer: userId,
      nickname,
      comments: newComments,
      likes: newLikes,
      createdAt,
    },
  });
};

/*
  db에 존재하는 모든 writing을 응답
*/
export const getAllWriting = async (req, res) => {
  const writings = await Writing.find();
  const data = await Promise.all(
    writings.map(
      async ({ _id, title, content, writer, comments, likes, createdAt }) => {
        const { userId, nickname } = await Account.findById(writer);
        const newLikes = await Promise.all(
          likes.map(async (id) => {
            const { userId } = await Account.findById(id);
            return userId;
          })
        );
        const newComments = await Promise.all(
          comments.map(async (el) => {
            const { userId, nickname } = await Account.findById(el.userId);
            return {
              userId,
              nickname,
              comment: el.comment,
            };
          })
        );
        return {
          id: _id,
          title,
          content,
          writer: userId,
          nickname,
          comments: newComments,
          likes: newLikes,
          createdAt,
        };
      }
    )
  );

  res.status(200).json({
    status: "success",
    data,
  });
};

/*
  글에 좋아요 눌렀을 때 누른 사람의 정보를 writing에 저장
*/
export const addLikeToWriting = async (req, res) => {
  const { writingId, userId } = req.body;

  // writingId를 가진 writing이 있는지 확인
  const writing = await Writing.findById(writingId);
  if (!writing) {
    return res.status(400).json({
      status: "fail",
      message: `Writing ID: ${writingId} does not exist!`,
    });
  }
  const { likes } = writing;
  // user가 존재하는지 확인
  const user = await Account.findOne({ userId });
  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: `user ID: ${userId} does not exist!`,
    });
  }
  const { _id } = user;
  // 먼저 writing의 likes에 userId가 존재하는지 확인
  // 존재한다면, 에러 응답
  if (likes.includes(_id)) {
    return res.status(400).json({
      status: "fail",
      message: `Cannot send like again`,
    });
  }
  // writing 컬렉션에서 해당 writing likes에 userId 추가하기
  likes.push(_id);
  await Writing.updateOne({ _id: writingId }, { likes });

  res.status(200).json({
    status: "success",
  });
};

/*
  댓글을 달았을 때 해당 정보를 writing에 저장
*/
export const commentToWriting = async (req, res) => {
  const { writingId, userId, comment } = req.body;

  // writingId를 가진 writing이 있는지 확인
  const writing = await Writing.findById(writingId);
  if (!writing) {
    return res.status(400).json({
      status: "fail",
      message: `Writing ID: ${writingId} does not exist!`,
    });
  }
  // user가 존재하는지 확인
  const user = await Account.findOne({ userId });
  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: `user ID: ${userId} does not exist!`,
    });
  }
  const { _id } = user;

  const { comments } = writing;
  // writing 컬렉션에서 해당 writing comments에 comment 추가하기
  comments.push({
    userId: _id,
    comment,
  });
  await Writing.updateOne({ _id: writingId }, { comments });

  res.status(200).json({
    status: "success",
  });
};