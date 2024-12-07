import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import { Comments, getRecreationByRecName, Recreation, searchCommentData } from '../services/services';
import RecInfoPage from '../components/RecInfoPage/RecInfoPage';
import CommentsTimeline from '../components/CommentsTimeline/CommentsTimeline';

const RecPage: React.FC = () =>  {
  const { RecName } = useParams();
  const [rec, setRecreation] = useState<Recreation | undefined>(undefined);
  const [comments, setComments] = useState<Comments[]>([]);
  
  const [fetchNewComment, setFetchNewComment] = useState<boolean>(false);

  useEffect(() => {
    if (RecName) { 
      const fetchRecreation = async () => {
        const data = await getRecreationByRecName(RecName);
        setRecreation(data);
      };
      fetchRecreation();
    }
  }, [RecName]);

  useEffect(() => { }, [rec]);


  useEffect(() => {
    if (RecName) {
        const fetchComment = async () => {
            const data = await searchCommentData(RecName);
            setComments(data);
        };
        fetchComment();
    }
}, [RecName]);  

  if (!rec) { return <></>; }

  const handleDeleteComment = (CommentId: number) => {
    const updatedComments = comments.filter((comment) => comment.CommentId !== CommentId);
    setComments(updatedComments);
    setFetchNewComment((prevState) => !prevState);
  };

  const handleAddComment = (newComment: Comments) => {
    setComments([...comments, newComment]);
  };


  const handleUpdateComment = (updatedComment: Comments) => {
      const updatedComments = comments.map((comment) =>
          comment.CommentId === updatedComment.CommentId ? updatedComment : comment
      );
      setComments(updatedComments);
  };

  return (
    <>
      <div className="overflow-hidden bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-7">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
            <Link to="/" className="text-grey-600 hover:underline">← Back To All Recreation</Link>
              <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {rec?.RecName || 'Loading...'}
              </h1>
              <h2 className="text-base font-semibold leading-7 text-blue">
                {rec?.StateName}
              </h2>
            </div>
          </div>
        </div>
      </div>


    {/* recinfopage */}
    {rec && (
      <div className="mx-auto max-w-7xl px-4 sm:px-12 lg:px-8">
        <RecInfoPage recreation={rec} />
      </div>
    )}


    {/* Comments Timeline */}
    {comments.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-12 lg:px-8">
            <CommentsTimeline
              comments={comments}
              onDelete={handleDeleteComment}
              onAdd={handleAddComment}
              onUpdate={handleUpdateComment}
              RecName={rec!.RecName}
              RecType={rec!.RecType}
            />
        </div>
    )}

    {/* No Comments Available */}
    {comments.length === 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-12 lg:px-8">
            <p className="text-lg text-gray-600">No comments available for this recreation.</p>
        </div>
    )
    }
    </>
  );
};

export default RecPage;