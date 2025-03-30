import React, { useState } from "react";
import { Media } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import styles from "../../styles/Comment.module.css"
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { MoreDropdown } from '../../components/MoreDropdown';
import { axiosRes } from '../../api/axiosDefaults';
import CommentEditForm from "./CommentEditForm";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

const Comment = (props) => {
    const { profile_id, profile_image, owner, updated_at, content, id, setPost, setComments, likes_count, like_id } = props;
    const [showEditForm, setShowEditForm] = useState(false);

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;

    const [commentsLikes, setCommentsLikes] = useState(like_id);
    const [commentsLikesCount, setCommentsLikesCount] = useState(likes_count);

    const handleDelete = async () => {
        try {
          await axiosRes.delete(`/comments/${id}/`);
          setPost((prevPost) => ({
            results: [
              {
                ...prevPost.results[0],
                comments_count: prevPost.results[0].comments_count - 1,
              },
            ],
          }));
    
          setComments((prevComments) => ({
            ...prevComments,
            results: prevComments.results.filter((comment) => comment.id !== id),
          }));
        } catch (err) {}
      };

      
    const handleLike = async () => {
        try {
            const { data } = await axiosRes.post("/commentslikes/", { comment: id });
            setCommentsLikes(data.id);
            setCommentsLikesCount(commentsLikesCount + 1);
        } catch (err) {}
    };

    const handleUnlike = async () => {
        try {
            await axiosRes.delete(`/commentslikes/${id}/`);
            setCommentsLikes(null);
            setCommentsLikesCount(commentsLikesCount - 1);
        } catch (err) {}
    };

    return (
        <div>
          <hr />
          <Media>
            <Link to={`/profiles/${profile_id}`}>
              <Avatar src={profile_image} />
            </Link>
            <Media.Body className="align-self-center ml-2">
              <span className={styles.Owner}>{owner}</span>
              <span className={styles.Date}>{updated_at?.humanized || "Unknown date"}</span>
              {showEditForm ? (
                <CommentEditForm 
                    id={id}
                    profile_id={profile_id}
                    content={content}
                    profileImage={profile_image}
                    setComments={setComments}
                    setShowEditForm={setShowEditForm}
                />
                ) : ( 
                <p>{content}</p>
                )}
                 <div>
                {is_owner ? (
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>You can't like your own comment!</Tooltip>}
                  >
                    <i className={`far fa-heart ${styles.HeartOutline}`} />
                  </OverlayTrigger>
                ) : commentsLikes ? (
                  <span onClick={handleUnlike}>
                    <i className={`fas fa-heart ${styles.Heart}`} />
                  </span>
                ) : currentUser ? (
                  <span onClick={handleLike}>
                    <i className={`far fa-heart ${styles.HeartOutline}`} />
                  </span>
                ) : (
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Log in to like comments!</Tooltip>}
                  >
                    <i className={`far fa-heart ${styles.HeartOutline}`} />
                  </OverlayTrigger>
                )}
                {commentsLikesCount}
              </div>
            </Media.Body>
            {is_owner && (
                <MoreDropdown 
                    handleEdit={() => setShowEditForm(true)} 
                    handleDelete={handleDelete} 
                />
            )}
          </Media>
        </div>
      );
    };
    
    export default Comment;