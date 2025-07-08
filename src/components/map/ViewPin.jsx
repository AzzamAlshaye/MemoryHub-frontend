// // src/components/ViewPin.jsx
// import React, { useState, useEffect } from "react";
// import { FaLocationDot } from "react-icons/fa6";
// import {
//   FaThumbsUp,
//   FaThumbsDown,
//   FaFlag,
//   FaTimes,
//   FaChevronLeft,
//   FaChevronRight,
// } from "react-icons/fa";
// import { IoIosSend } from "react-icons/io";

// import ReportPopup from "./ReportPopup";
// import { pinService } from "../../service/pinService";
// import { commentService } from "../../service/commentService";
// import { likeService } from "../../service/likeService";
// import { reportService } from "../../service/reportService";

// export default function ViewPin({
//   pinId,
//   onClose,
//   currentUser = { name: "You", avatar: "https://via.placeholder.com/40" },
// }) {
//   const [pin, setPin] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [likes, setLikes] = useState(0);
//   const [dislikes, setDislikes] = useState(0);
//   const [myReaction, setMyReaction] = useState(null);
//   const [commentReactions, setCommentReactions] = useState({});
//   const [currentIdx, setCurrentIdx] = useState(0);
//   const [showReport, setShowReport] = useState(null);

//   useEffect(() => {
//     if (!pinId) return;

//     pinService.get(pinId).then((data) => {
//       setPin(data);
//       setLikes(data.likes || 0);
//       setDislikes(data.dislikes || 0);
//       setCurrentIdx(0);
//     });

//     likeService
//       .list("pin", pinId)
//       .then(({ likes: l, dislikes: d }) => {
//         setLikes(l);
//         setDislikes(d);
//       })
//       .catch(console.error);

//     likeService
//       .getMyReaction("pin", pinId)
//       .then((r) => setMyReaction(r?.type || null))
//       .catch(() => setMyReaction(null));

//     commentService
//       .listByPin(pinId)
//       .then((cs) =>
//         cs.map((c) => ({
//           ...c,
//           likes: c.likes || 0,
//           dislikes: c.dislikes || 0,
//         }))
//       )
//       .then((loadedComments) => {
//         setComments(loadedComments);
//         loadedComments.forEach((c) => {
//           likeService
//             .getMyReaction("comment", c.id)
//             .then((r) =>
//               setCommentReactions((prev) => ({
//                 ...prev,
//                 [c.id]: r?.type || null,
//               }))
//             )
//             .catch(() => {});
//         });
//       })
//       .catch(console.error);
//   }, [pinId]);

//   if (!pin) return null;

//   const images = Array.isArray(pin.media?.images)
//     ? pin.media.images.map((i) => (typeof i === "string" ? i : i.url))
//     : [];
//   const rawV = pin.media?.video;
//   const vUrl = rawV && (typeof rawV === "string" ? rawV : rawV.url);
//   const mediaItems = [
//     ...(vUrl ? [{ type: "video", url: vUrl }] : []),
//     ...images.map((url) => ({ type: "image", url })),
//   ];

//   const fmtDate = (iso) =>
//     new Date(iso).toLocaleDateString(undefined, {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });

//   const refreshPin = () => {
//     likeService
//       .list("pin", pinId)
//       .then(({ likes: l, dislikes: d }) => {
//         setLikes(l);
//         setDislikes(d);
//       })
//       .catch(console.error);
//   };

// const handlePinReact = (type) => {
//   const isSameReaction = myReaction === type;
//   const newType = isSameReaction ? null : type;

//   likeService
//     .create({ targetType: "pin", targetId: pinId, type: newType })
//     .then(() => {
//       setMyReaction(newType);

//       setLikes((prev) => {
//         if (type === "like") {
//           if (isSameReaction) return prev - 1; 
//           else if (myReaction === "dislike") return prev + 1; 
//           else return prev + 1; 
//         }
//         return prev;
//       });

//       setDislikes((prev) => {
//         if (type === "dislike") {
//           if (isSameReaction) return prev - 1;
//           else if (myReaction === "like") return prev + 1; 
//           else return prev + 1; 
//         }
//         return prev;
//       });
//     })
//     .catch(console.error);
// };


//   const handleCommentReact = (cid, type) => {
//     const prev = commentReactions[cid];
//     const newType = prev === type ? null : type;

//     likeService
//       .create({
//         targetType: "comment",
//         targetId: cid,
//         type: newType || type,
//       })
//       .then(() =>
//         likeService.list("comment", cid).then(({ likes, dislikes }) => {
//           setComments((prev) =>
//             prev.map((c) => (c.id === cid ? { ...c, likes, dislikes } : c))
//           );
//           setCommentReactions((prev) => ({
//             ...prev,
//             [cid]: newType,
//           }));
//         })
//       )
//       .catch(console.error);
//   };

//   const handleAddComment = (e) => {
//     e.preventDefault();
//     const text = e.target.elements.comment.value.trim();
//     if (!text) return;

//     commentService
//       .create({ pinId, text })
//       .then((nc) => {
//         const newComment = {
//           ...nc,
//           author: {
//             name: currentUser.name,
//             avatar: currentUser.avatar,
//           },
//           likes: 0,
//           dislikes: 0,
//         };
//         setComments((prev) => [newComment, ...prev]);
//         e.target.reset();
//       })
//       .catch(console.error);
//   };

//   const handleReport = ({ reason, description }) => {
//     if (!showReport || !reason.trim()) return;
//     const { type: tType, id: tId } = showReport;
//     reportService
//       .create({
//         targetType: tType,
//         targetId: tId,
//         reason: reason.trim(),
//         ...(description?.trim() && { description: description.trim() }),
//       })
//       .then(() => setShowReport(null))
//       .catch(console.error);
//   };

//   const navigate = (step) =>
//     setCurrentIdx((i) => (i + step + mediaItems.length) % mediaItems.length);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm p-4">
//       <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//         >
//           <FaTimes size={24} />
//         </button>

//         {/* Header */}
//         <header className="p-6 border-b">
//           <h2 className="text-2xl font-sans">{pin.title}</h2>
//           <div className="mt-4 flex items-center gap-3">
//             <img
//               src={pin.owner?.avatar || currentUser.avatar}
//               alt={pin.owner?.name || currentUser.name}
//               className="w-10 h-10 rounded-full object-cover"
//             />
//             <div className="text-sm text-gray-500">
//               <p className="font-sans">
//                 {pin.owner?.name || currentUser.name}
//               </p>
//               <time dateTime={pin.createdAt}>{fmtDate(pin.createdAt)}</time>
//             </div>
//             <div className="ml-auto flex flex-wrap gap-2">
//               <span className="px-3 py-1 text-xs bg-amber-200 text-amber-600 rounded-full">
//                 {pin.privacy}
//               </span>
//             </div>
//           </div>
//         </header>

//         {/* Media */}
//         {mediaItems.length > 0 && (
//           <div className="relative bg-gray-100">
//             <div className="w-full aspect-video">
//               {mediaItems[currentIdx].type === "image" ? (
//                 <img
//                   src={mediaItems[currentIdx].url}
//                   alt={`Slide ${currentIdx + 1}`}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <video
//                   controls
//                   src={mediaItems[currentIdx].url}
//                   className="w-full h-full object-cover"
//                 />
//               )}
//             </div>
//             <button
//               onClick={() => navigate(-1)}
//               className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full"
//             >
//               <FaChevronLeft />
//             </button>
//             <button
//               onClick={() => navigate(1)}
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full"
//             >
//               <FaChevronRight />
//             </button>
//           </div>
//         )}

//         {/* Body */}
//         <section className="p-6 space-y-6">
//           <p className="text-gray-700">{pin.description}</p>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-6">
//               <button
//                 onClick={() => handlePinReact("like")}
//                 className={
//                   "flex items-center gap-1 " +
//                   (myReaction === "like"
//                     ? "text-blue-500"
//                     : "text-gray-500 hover:text-blue-500")
//                 }
//               >
//                 <FaThumbsUp /> {likes}
//               </button>
//               <button
//                 onClick={() => handlePinReact("dislike")}
//                 className={
//                   "flex items-center gap-1 " +
//                   (myReaction === "dislike"
//                     ? "text-red-500"
//                     : "text-gray-500 hover:text-red-500")
//                 }
//               >
//                 <FaThumbsDown /> {dislikes}
//               </button>
//             </div>
//             <button
//               onClick={() => setShowReport({ type: "pin", id: pinId })}
//               className="flex text-gray-500 items-center gap-1 hover:text-yellow-500"
//             >
//               <FaFlag /> Report
//             </button>
//           </div>

//           {/* Comments */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">
//               Comments ({comments.length})
//             </h3>
//             <div className="max-h-64 overflow-y-auto space-y-4">
//               {comments.map((c) => (
//                 <div key={c.id} className="flex items-start gap-3">
//                   <img
//                     src={c.author.avatar}
//                     alt={c.author.name}
//                     className="w-8 h-8 rounded-full"
//                   />
//                   <div className="flex-1">
//                     <div className="flex items-center justify-between">
//                       <p className="font-medium text-sm">{c.author.name}</p>
//                       <time
//                         className="text-xs text-gray-500"
//                         dateTime={c.createdAt}
//                       >
//                         {fmtDate(c.createdAt)}
//                       </time>
//                     </div>
//                     <p className="mt-1 text-gray-700">{c.content}</p>
//                     <div className="mt-2 flex justify-between items-center text-sm">
//                       <div className="flex items-center gap-4">
//                         <button
//                           onClick={() => handleCommentReact(c.id, "like")}
//                           className={
//                             "flex items-center gap-1 " +
//                             (commentReactions[c.id] === "like"
//                               ? "text-blue-600"
//                               : "text-gray-500 hover:text-blue-600")
//                           }
//                         >
//                           <FaThumbsUp /> {c.likes}
//                         </button>
//                         <button
//                           onClick={() => handleCommentReact(c.id, "dislike")}
//                           className={
//                             "flex items-center gap-1 " +
//                             (commentReactions[c.id] === "dislike"
//                               ? "text-red-600"
//                               : "text-gray-500 hover:text-red-600")
//                           }
//                         >
//                           <FaThumbsDown /> {c.dislikes}
//                         </button>
//                       </div>
//                       <button
//                         onClick={() =>
//                           setShowReport({ type: "comment", id: c.id })
//                         }
//                         className="flex items-center gap-1 text-gray-400 hover:text-yellow-600"
//                       >
//                         <FaFlag />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Add comment */}
//             <form
//               onSubmit={handleAddComment}
//               className="mt-6 flex items-center gap-3 border-t pt-4"
//             >
//               <img
//                 src={currentUser.avatar}
//                 alt={currentUser.name}
//                 className="w-9 h-9 rounded-full shadow-md"
//               />
//               <textarea
//                 name="comment"
//                 rows={1}
//                 placeholder="Write a comment..."
//                 className="flex-1 rounded-lg border border-gray-300 p-3 text-sm resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               <button
//                 type="submit"
//                 className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
//                 title="Send"
//               >
//                 <IoIosSend size={20} />
//               </button>
//             </form>
//           </div>
//         </section>

//         {showReport && (
//           <ReportPopup
//             target={showReport}
//             onCancel={() => setShowReport(null)}
//             onSubmit={handleReport}
//           />
//         )}
//       </div>
//     </div>
//   );
// }


// src/components/ViewPin.jsx
import React, { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaFlag,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

import ReportPopup from "./ReportPopup";
import { pinService } from "../../service/pinService";
import { commentService } from "../../service/commentService";
import { likeService } from "../../service/likeService";
import { reportService } from "../../service/reportService";

export default function ViewPin({
  pinId,
  onClose,
  currentUser: propCurrentUser, 
}) {
  const [pin, setPin] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [myReaction, setMyReaction] = useState(null);
  const [commentReactions, setCommentReactions] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showReport, setShowReport] = useState(null);
  const [currentUser, setCurrentUser] = useState(propCurrentUser);

 useEffect(() => {
    // Load current user from localStorage first (if available)
    const storedUserJson = localStorage.getItem("currentUser");
    if (storedUserJson) {
      try {
        const storedUser = JSON.parse(storedUserJson);
        setCurrentUser(storedUser);
      } catch {
        setCurrentUser(propCurrentUser);
      }
    } else {
      setCurrentUser(propCurrentUser);
    }
  }, [propCurrentUser]);

  useEffect(() => {
    if (!pinId) return;

    pinService.get(pinId).then((data) => {
      setPin(data);
      setLikes(data.likes || 0);
      setDislikes(data.dislikes || 0);
      setCurrentIdx(0);
    });
    likeService
      .list("pin", pinId)
      .then(({ likes: l, dislikes: d }) => {
        setLikes(l);
        setDislikes(d);
      })
      .catch(console.error);

    likeService
      .getMyReaction("pin", pinId)
      .then((r) => setMyReaction(r?.type || null))
      .catch(() => setMyReaction(null));

    commentService
      .listByPin(pinId)
      .then((cs) =>
        cs.map((c) => ({
          ...c,
          likes: c.likes || 0,
          dislikes: c.dislikes || 0,
        }))
      )
      .then((loadedComments) => {
        setComments(loadedComments);
        loadedComments.forEach((c) => {
          likeService
            .getMyReaction("comment", c.id)
            .then((r) =>
              setCommentReactions((prev) => ({
                ...prev,
                [c.id]: r?.type || null,
              }))
            )
            .catch(() => {});
        });
      })
      .catch(console.error);
  }, [pinId]);

  if (!pin) return null;

  const images = Array.isArray(pin.media?.images)
    ? pin.media.images.map((i) => (typeof i === "string" ? i : i.url))
    : [];
  const rawV = pin.media?.video;
  const vUrl = rawV && (typeof rawV === "string" ? rawV : rawV.url);
  const mediaItems = [
    ...(vUrl ? [{ type: "video", url: vUrl }] : []),
    ...images.map((url) => ({ type: "image", url })),
  ];

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const refreshPin = () => {
    likeService
      .list("pin", pinId)
      .then(({ likes: l, dislikes: d }) => {
        setLikes(l);
        setDislikes(d);
      })
      .catch(console.error);
  };

  const handlePinReact = (type) => {
    const isSameReaction = myReaction === type;
    const newType = isSameReaction ? null : type;

    likeService
      .create({ targetType: "pin", targetId: pinId, type: newType })
      .then(() => {
        setMyReaction(newType);

        setLikes((prev) => {
          if (type === "like") {
            if (isSameReaction) return prev - 1;
            else if (myReaction === "dislike") return prev + 1;
            else return prev + 1;
          }
          return prev;
        });

        setDislikes((prev) => {
          if (type === "dislike") {
            if (isSameReaction) return prev - 1;
            else if (myReaction === "like") return prev + 1;
            else return prev + 1;
          }
          return prev;
        });
      })
      .catch(console.error);
  };

  const handleCommentReact = (cid, type) => {
    const prev = commentReactions[cid];
    const newType = prev === type ? null : type;

    likeService
      .create({
        targetType: "comment",
        targetId: cid,
        type: newType || type,
      })
      .then(() =>
        likeService.list("comment", cid).then(({ likes, dislikes }) => {
          setComments((prev) =>
            prev.map((c) => (c.id === cid ? { ...c, likes, dislikes } : c))
          );
          setCommentReactions((prev) => ({
            ...prev,
            [cid]: newType,
          }));
        })
      )
      .catch(console.error);
  };

const handleAddComment = (e) => {
    e.preventDefault();
    const text = e.target.elements.comment.value.trim();
    if (!text) return;

    commentService
      .create({ pinId, text })
      .then((newComment) => {
        // Use currentUser state here to set author info
        const authorName = currentUser?.name || "You";
        const authorAvatar = currentUser?.avatar || "https://via.placeholder.com/40";

        const commentToAdd = {
          ...newComment,
          author: {
            name: authorName,
            avatar: authorAvatar,
          },
          likes: 0,
          dislikes: 0,
        };

        setComments((prev) => [commentToAdd, ...prev]);
        e.target.reset();
      })
      .catch(console.error);
  };

  const handleReport = ({ reason, description }) => {
    if (!showReport || !reason.trim()) return;
    const { type: tType, id: tId } = showReport;
    reportService
      .create({
        targetType: tType,
        targetId: tId,
        reason: reason.trim(),
        ...(description?.trim() && { description: description.trim() }),
      })
      .then(() => setShowReport(null))
      .catch(console.error);
  };

  const navigate = (step) =>
    setCurrentIdx((i) => (i + step + mediaItems.length) % mediaItems.length);
const displayName = pin.owner?.name || currentUser?.name || "Guest";
  const displayAvatar =
    pin.owner?.avatar || currentUser?.avatar || "https://via.placeholder.com/40";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <FaTimes size={24} />
        </button>

        {/* Header */}
        <header className="p-6 border-b">
          <h2 className="text-2xl font-sans">{pin.title}</h2>
          <div className="mt-4 flex items-center gap-3">
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-sm text-gray-500">
              <p className="font-sans">{displayName}</p>
              <time dateTime={pin.createdAt}>{fmtDate(pin.createdAt)}</time>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs bg-amber-200 text-amber-600 rounded-full">
                {pin.privacy}
              </span>
            </div>
          </div>
        </header>

        {/* Media */}
        {mediaItems.length > 0 && (
          <div className="relative bg-gray-100">
            <div className="w-full aspect-video">
              {mediaItems[currentIdx].type === "image" ? (
                <img
                  src={mediaItems[currentIdx].url}
                  alt={`Slide ${currentIdx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  controls
                  src={mediaItems[currentIdx].url}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <button
              onClick={() => navigate(-1)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full"
              aria-label="Previous media"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => navigate(1)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full"
              aria-label="Next media"
            >
              <FaChevronRight />
            </button>
          </div>
        )}

        {/* Body */}
        <section className="p-6 space-y-6">
          <p className="text-gray-700">{pin.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => handlePinReact("like")}
                className={
                  "flex items-center gap-1 " +
                  (myReaction === "like"
                    ? "text-blue-500"
                    : "text-gray-500 hover:text-blue-500")
                }
                aria-label="Like pin"
              >
                <FaThumbsUp /> {likes}
              </button>
              <button
                onClick={() => handlePinReact("dislike")}
                className={
                  "flex items-center gap-1 " +
                  (myReaction === "dislike"
                    ? "text-red-500"
                    : "text-gray-500 hover:text-red-500")
                }
                aria-label="Dislike pin"
              >
                <FaThumbsDown /> {dislikes}
              </button>
            </div>
            <button
              onClick={() => setShowReport({ type: "pin", id: pinId })}
              className="flex text-gray-500 items-center gap-1 hover:text-yellow-500"
              aria-label="Report pin"
            >
              <FaFlag /> Report
            </button>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Comments ({comments.length})
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-4" aria-live="polite">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <img
                    src={c.author.avatar}
                    alt={c.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{c.author.name}</p>
                      <time
                        className="text-xs text-gray-500"
                        dateTime={c.createdAt}
                      >
                        {fmtDate(c.createdAt)}
                      </time>
                    </div>
                    <p className="mt-1 text-gray-700">{c.content}</p>
                    <div className="mt-2 flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleCommentReact(c.id, "like")}
                          className={
                            "flex items-center gap-1 " +
                            (commentReactions[c.id] === "like"
                              ? "text-blue-600"
                              : "text-gray-500 hover:text-blue-600")
                          }
                          aria-label={`Like comment by ${c.author.name}`}
                        >
                          <FaThumbsUp /> {c.likes}
                        </button>
                        <button
                          onClick={() => handleCommentReact(c.id, "dislike")}
                          className={
                            "flex items-center gap-1 " +
                            (commentReactions[c.id] === "dislike"
                              ? "text-red-600"
                              : "text-gray-500 hover:text-red-600")
                          }
                          aria-label={`Dislike comment by ${c.author.name}`}
                        >
                          <FaThumbsDown /> {c.dislikes}
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          setShowReport({ type: "comment", id: c.id })
                        }
                        className="flex items-center gap-1 text-gray-400 hover:text-yellow-600"
                        aria-label={`Report comment by ${c.author.name}`}
                      >
                        <FaFlag />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add comment */}
            <form
              onSubmit={handleAddComment}
              className="mt-6 flex items-center gap-3 border-t pt-4"
            >
              <img
                src={currentUser?.avatar || "https://via.placeholder.com/40"}
                alt={currentUser?.name || "Guest"}
                className="w-9 h-9 rounded-full shadow-md"
              />
              <textarea
                name="comment"
                rows={1}
                placeholder="Write a comment..."
                className="flex-1 rounded-lg border border-gray-300 p-3 text-sm resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Add a comment"
              />
              <button
                type="submit"
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                title="Send"
                aria-label="Send comment"
              >
                <IoIosSend size={20} />
              </button>
            </form>
          </div>
        </section>

        {showReport && (
          <ReportPopup
            target={showReport}
            onCancel={() => setShowReport(null)}
            onSubmit={handleReport}
          />
        )}
      </div>
    </div>
  );
}
