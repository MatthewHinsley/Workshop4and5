import React from 'react';
import {unixTimeToString} from '../util.js'
import {Link} from 'react-router';
import {likeCommentItem, unlikeCommentItem} from '../server.js';

export default class Comment extends React.Component {
  /**
   * Returns 'true' if the user liked the item.
   * Returns 'false' if the user has not liked the item.
   */
   constructor(props) {
      super(props);
      this.state = props;
    }

    /**
    * Triggered when the user clicks on the 'like' or 'unlike' button.
    */
   handleLikeClick(clickEvent) {
     // Stop the event from propagating up the DOM tree, since we handle it here.
     // Also prevents the link click from causing the page to scroll to the top.
     clickEvent.preventDefault();
     // 0 represents the 'main mouse button' -- typically a left click
     // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
     if (clickEvent.button === 0) {
       // Callback function for both the like and unlike cases.
       var callbackFunction = (updatedLikeCounter) => {
         // setState will overwrite the 'likeCounter' field on the current
         // state, and will keep the other fields in-tact.
         // This is called a shallow merge:
         // https://facebook.github.io/react/docs/component-api.html#setstate
         this.state.comment.likeCounter = updatedLikeCounter;
         this.setState({comment: this.state.comment});
       };

       if (this.didUserLike()) {
         // User clicked 'unlike' button.
         unlikeCommentItem(this.state.feedItemId, 4, this.state.index, callbackFunction);
       } else {
         // User clicked 'like' button.
         likeCommentItem(this.state.feedItemId, 4, this.state.index, callbackFunction);
       }
     }
   }

   /**
    * Returns 'true' if the user liked the item.
    * Returns 'false' if the user has not liked the item.
    */
   didUserLike() {
     var likeCounter = this.state.comment.likeCounter;
     var liked = false;
     // Look for a likeCounter entry with userId 4 -- which is the
     // current user.
     for (var i = 0; i < likeCounter.length; i++) {
       if (likeCounter[i]._id === 4) {
         liked = true;
         break;
       }
     }
     return liked;
   }

  render() {
    var likeButtonText = "Like";
    if (this.didUserLike()) {
      likeButtonText = "Unlike";
    }
    return (
      <div>
        <div className="media-left media-top">
          PIC
        </div>
        <div className="media-body">
          <Link to={"/profile/" + this.state.comment.author._id}>{this.state.comment.author.fullName}</Link> {this.state.comment.content}
          <br />
          <a href="#" onClick={(e) => this.handleLikeClick(e)}>
            {likeButtonText} ({this.state.comment.likeCounter.length})
          </a> · <a href="#">Reply</a> · {unixTimeToString(this.state.comment.postDate)}
        </div>
      </div>
    )
  }
}
