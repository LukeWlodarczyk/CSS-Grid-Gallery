import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { deletePost, addLike, disLike } from '../../actions/post';
import PostButton from './PostButton';

class PostItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			likesCount: this.props.post.likes.length,
			dislikesCount: this.props.post.dislikes.length,
			likes: this.props.post.likes,
			dislikes: this.props.post.dislikes,
		};
	}

	static getDerivedStateFromProps(nextProps) {
		return {
			likesCount: nextProps.post.likes.length,
			dislikesCount: nextProps.post.dislikes.length,
			likes: nextProps.post.likes,
			dislikes: nextProps.post.dislikes,
		};
	}

	onDeleteClick = postId => {
		this.props.deletePost(postId, this.props.history);
	};

	onLikeClick = postId => {
		this.props.addLike(postId, this.props.auth.user.id);
	};

	onDisLikeClick = postId => {
		this.props.disLike(postId, this.props.auth.user.id);
	};

	render() {
		const { post, auth, showActions, truncate } = this.props;

		const user = {
			username: post.user ? post.user.username : 'deleted',
			avatar: post.user
				? post.user.avatar
				: 'http://www.gravatar.com/avatar/37d96b80617a8fe7f294ecd968da71d3?s=200&r=pg&d=mm',
			name: post.user ? post.user.name : 'User deleted',
			id: post.user ? post.user._id : 'deleted',
		};

		return (
			<div className="card card-body sm-3 mb-3">
				<div className="row">
					<div className="col-sm-2">
						<Link to={'/profile/' + user.username} className="btn btn-info">
							<img
								className="rounded-circle d-none d-sm-block"
								src={user.avatar}
								alt=""
							/>
							<br />
							<p className="text-center" style={{ whiteSpace: 'pre-wrap' }}>
								{user.name}
							</p>
						</Link>
					</div>
					<div className="col-sm-10 px-3 px-sm-5">
						<h3>{post.title}</h3>
						<div className="small text-right">
							{new Date(post.date).toLocaleDateString()}
						</div>
						<p className={truncate ? 'lead text-truncate' : 'lead'}>
							{post.text}
						</p>
						{!showActions && (
							<div className="mb-1">
								<span className="badge badge-success">
									{this.state.likesCount}
								</span>
								<span>-</span>
								<span className="badge badge-danger">
									{this.state.dislikesCount}
								</span>
							</div>
						)}
						{!showActions && (
							<Link to={`/post/${post._id}`} className="btn btn-info mr-2">
								{post.comments.length} comments
							</Link>
						)}
						{showActions && (
							<span>
								<PostButton
									onClick={this.onLikeClick}
									postId={post._id}
									icon={
										this.state.likes.some(like => like.user === auth.user.id)
											? 'fas fa-thumbs-up text-success'
											: 'fas fa-thumbs-up'
									}
									styles="btn btn-light mr-1"
									count={this.state.likesCount}
								/>
								<PostButton
									onClick={this.onDisLikeClick}
									postId={post._id}
									icon={
										this.state.dislikes.some(
											dislike => dislike.user === auth.user.id
										)
											? 'fas fa-thumbs-down text-danger'
											: 'fas fa-thumbs-down'
									}
									styles="btn btn-light mr-1"
									count={this.state.dislikesCount}
								/>
							</span>
						)}
						{user.id === auth.user.id && (
							<PostButton
								onClick={this.onDeleteClick}
								postId={post._id}
								icon={'fas fa-times'}
								styles="btn btn-danger mr-1"
								count={false}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}

PostItem.defaultProps = {
	showActions: true,
	truncate: true,
};

PostItem.propTypes = {
	deletePost: PropTypes.func.isRequired,
	addLike: PropTypes.func.isRequired,
	disLike: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(
	mapStateToProps,
	{ deletePost, addLike, disLike }
)(withRouter(PostItem));
