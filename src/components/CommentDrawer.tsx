import React, { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { BoardItem, Comment } from '../types';

interface CommentDrawerProps {
  item: BoardItem | null;
  onClose: () => void;
  onAddComment: (itemId: string, commentText: string) => void;
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({
  item,
  onClose,
  onAddComment
}) => {
  const [newComment, setNewComment] = useState('');

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(item.id, newComment.trim());
    setNewComment('');
  };

  return (
    <div className="comment-drawer-overlay" onClick={onClose}>
      <div className="comment-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={18} color="var(--primary-color)" />
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{item.name || 'Untitled Item'}</h3>
          </div>
          <button className="header-icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body - Comment History */}
        <div className="drawer-body">
          {item.commentsList.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: 40 }}>
              <MessageSquare size={36} style={{ opacity: 0.3, marginBottom: 8 }} />
              <p>No updates yet for this item.</p>
              <span style={{ fontSize: '12px' }}>Start the conversation by posting an update below!</span>
            </div>
          ) : (
            item.commentsList.map((comment) => (
              <div key={comment.id} className="comment-card">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span>{comment.timestamp}</span>
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.5 }}>
                  {comment.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input Footer */}
        <form className="comment-input-area" onSubmit={handleSubmit}>
          <textarea 
            placeholder="Write an update..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" type="submit" disabled={!newComment.trim()}>
              <Send size={14} />
              <span>Update</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
