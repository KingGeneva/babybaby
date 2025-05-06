
import React from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useForumFormatters } from '@/components/forum/hooks/useForumFormatters';
import { useTopicPage } from '@/components/forum/hooks/useTopicPage';
import TopicHeader from '@/components/forum/components/TopicHeader';
import TopicReplies from '@/components/forum/components/TopicReplies';
import ReplyForm from '@/components/forum/components/ReplyForm';
import AuthNotice from '@/components/forum/components/AuthNotice';
import { useAuth } from '@/contexts/AuthContext';

const ForumTopicPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { user } = useAuth();
  const { formatDate, formatExactDate, getInitials } = useForumFormatters();
  const {
    topic,
    posts,
    loading,
    page,
    totalPages,
    replyContent,
    setReplyContent,
    submitting,
    handlePageChange,
    handleSubmitReply,
    handleLikeTopic,
    handleLikePost
  } = useTopicPage(topicId);

  if (!user) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="pt-24 pb-20 px-4">
          <AuthNotice />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-babybaby-cosmic"></div>
            </div>
          ) : (
            <div className="mb-8">
              <TopicHeader
                topic={topic}
                formatDate={formatDate}
                formatExactDate={formatExactDate}
                handleLikeTopic={handleLikeTopic}
              />
              
              <TopicReplies
                posts={posts}
                page={page}
                totalPages={totalPages}
                formatDate={formatDate}
                formatExactDate={formatExactDate}
                handleLikePost={handleLikePost}
                handlePageChange={handlePageChange}
                getInitials={getInitials}
              />
              
              {!topic?.is_locked && (
                <ReplyForm
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  handleSubmitReply={handleSubmitReply}
                  submitting={submitting}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForumTopicPage;
