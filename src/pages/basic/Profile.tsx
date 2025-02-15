import type React from "react"
import { useState } from "react"
import PostContainer from "../../components/Container"
import { Edit2, ImageIcon, X } from "lucide-react"
import PostCard from "../../components/PostCard"

const dummyUserInfo = {
    name: "김아프간타",
    role: "중앙관리본부 개발 담당 인턴",
    profileImage: "/kimafganta.png?height=150&width=150",
    postsCount: 42,
    followersCount: 1337,
    followingCount: 420,
    bio: "열정적인 개발자, 창의적인 문제 해결사, 그리고 끊임없는 학습자입니다. 새로운 기술에 대한 호기심과 도전 정신으로 가득 차 있습니다. 함께 성장하고 혁신을 만들어가는 것이 제 목표입니다.",
}

const dummyPosts = [
    { id: 1, title: "React의 신비한 세계", username: "김아프간타", content: "React를 사용하면서 발견한 놀라운 점들..." },
    { id: 2, title: "TypeScript 마스터하기", username: "김아프간타", content: "TypeScript의 고급 기능을 파헤쳐봅시다." },
    { id: 3, title: "Next.js로 SEO 최적화하기", username: "김아프간타", content: "Next.js를 활용한 SEO 최적화 전략" },
]

const Profile: React.FC = () => {
    const [postVisibility, setPostVisibility] = useState<"public" | "private">("public")
    const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false)
    const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false)
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)

    return (
        <PostContainer>
            <div className="max-w-4xl mx-auto">
                <p className="text-3xl font-bold mb-5 text-gray-800 dark:text-gray-100">내 프로필</p>
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center space-x-6">
                            <img
                                src={dummyUserInfo.profileImage || "/kimafganta.png"}
                                alt={dummyUserInfo.name}
                                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                            />
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold ml-2 text-gray-800 dark:text-gray-100">{dummyUserInfo.name}</h1>
                                <p className="text-gray-600 dark:text-gray-300 ml-2">{dummyUserInfo.role}</p>
                                <div className="flex space-x-4 mt-4 mr-4">
                                    <div className="flex flex-col items-center justify-center cursor-default px-2 py-1">
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">
                                            {dummyUserInfo.postsCount}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">포스트</p>
                                    </div>
                                    <div
                                        onClick={() => setIsFollowersModalOpen(true)}
                                        className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-xl transition"
                                    >
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">
                                            {dummyUserInfo.followersCount}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">팔로워</p>
                                    </div>
                                    <div
                                        onClick={() => setIsFollowingModalOpen(true)}
                                        className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-xl transition"
                                    >
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">
                                            {dummyUserInfo.followingCount}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">팔로잉</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditProfileModalOpen(true)}
                                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center"
                            >
                                <Edit2 size={18} className="mr-2"/>
                                프로필 수정
                            </button>
                        </div>
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">자기소개</h2>
                            <p className="text-gray-700 dark:text-gray-300">{dummyUserInfo.bio}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">내 게시물</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setPostVisibility("public")}
                                className={`px-4 py-2 rounded-full ${
                                    postVisibility === "public"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                }`}
                            >
                                공개 글
                            </button>
                            <button
                                onClick={() => setPostVisibility("private")}
                                className={`px-4 py-2 rounded-full ${
                                    postVisibility === "private"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                }`}
                            >
                                비공개 글
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {dummyPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </div>

            <FollowersModal isOpen={isFollowersModalOpen} onClose={() => setIsFollowersModalOpen(false)} />
            <FollowingModal isOpen={isFollowingModalOpen} onClose={() => setIsFollowingModalOpen(false)} />
            <EditProfileModal isOpen={isEditProfileModalOpen} onClose={() => setIsEditProfileModalOpen(false)} />
        </PostContainer>
    )
}

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({
                                                                                                                 isOpen,
                                                                                                                 onClose,
                                                                                                                 title,
                                                                                                                 children,
                                                                                                             }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 dark:bg-black/70 flex">
            <div className="relative p-8 bg-white dark:bg-gray-800 w-full max-w-md m-auto flex-col flex rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
                        <X size={24} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

const FollowersModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const followers = [
        { id: 1, name: "홍길동", image: "/placeholder.svg?height=50&width=50" },
        { id: 2, name: "김철수", image: "/placeholder.svg?height=50&width=50" },
        { id: 3, name: "이영희", image: "/placeholder.svg?height=50&width=50" },
    ]

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="내 팔로워">
            <ul className="space-y-4">
                {followers.map((follower) => (
                    <li key={follower.id} className="flex items-center space-x-3">
                        <img
                            src={follower.image || "/placeholder.svg"}
                            alt={follower.name}
                            className="w-10 h-10 rounded-full"
                        />
                        <span className="text-gray-800 dark:text-gray-100">{follower.name}</span>
                    </li>
                ))}
            </ul>
        </Modal>
    )
}

const FollowingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const following = [
        { id: 1, name: "박지성", image: "/placeholder.svg?height=50&width=50" },
        { id: 2, name: "손흥민", image: "/placeholder.svg?height=50&width=50" },
        { id: 3, name: "김연아", image: "/placeholder.svg?height=50&width=50" },
    ]

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="팔로우 한 노더">
            <ul className="space-y-4">
                {following.map((follow) => (
                    <li key={follow.id} className="flex items-center space-x-3">
                        <img
                            src={follow.image || "/placeholder.svg"}
                            alt={follow.name}
                            className="w-10 h-10 rounded-full"
                        />
                        <span className="text-gray-800 dark:text-gray-100">{follow.name}</span>
                    </li>
                ))}
            </ul>
        </Modal>
    )
}

const EditProfileModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="프로필 수정">
            <form className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        이름
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    />
                </div>
                <div>
                    <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        자기소개
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    ></textarea>
                </div>
                <div>
                    <label
                        htmlFor="profileImage"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        프로필 이미지
                    </label>
                    <div className="mt-1 flex items-center">
            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-600">
              <ImageIcon className="h-full w-full text-gray-300" />
            </span>
                        <button
                            type="button"
                            className="ml-5 bg-white dark:bg-gray-600 py-2 px-3 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            변경
                        </button>
                    </div>
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        저장
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default Profile
