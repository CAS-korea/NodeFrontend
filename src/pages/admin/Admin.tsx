"use client"

import React, { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    AlertTriangle,
    Ban,
    CheckCircle,
    Edit,
    Flag,
    MessageSquare,
    Shield,
    Users,
    X,
} from "lucide-react"
import { useServices } from "../../context/ServicesProvider"
import type { UserEntity } from "../../types/UserEntity"
import CheerOverlay from "../../components/secretfile/CheerOverlay"
import UpdateModal from "../../components/admin/UpdateModal"
import BanModal from "../../components/admin/BanModal"

// PostContainer 대신 여유로운 레이아웃을 위한 Container
const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        {children}
    </div>
)

// Mock data (추후 실제 API 데이터로 교체)
const mockReportedPosts = [
    { id: "1", title: "부적절한 내용의 게시물", author: "user123", reportCount: 15, reason: "스팸", date: "2024-02-28" },
    { id: "2", title: "불쾌감을 주는 게시물", author: "user456", reportCount: 8, reason: "욕설", date: "2024-02-27" },
]

const mockReportedComments = [
    { id: "1", content: "부적절한 댓글 내용", author: "user789", reportCount: 12, reason: "혐오", date: "2024-02-28" },
    { id: "2", content: "스팸성 댓글", author: "user101", reportCount: 6, reason: "스팸", date: "2024-02-27" },
]

const Admin: React.FC = () => {
    // 기존 상태 관리
    const [editMode, setEditMode] = useState<"update" | "ban" | null>(null)
    const [userList, setUserList] = useState<UserEntity[]>([])
    const [nonuserList, setNonuserList] = useState<UserEntity[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [editingUser, setEditingUser] = useState<UserEntity | null>(null)
    const [banDays, setBanDays] = useState<number>(0)

    // 신규: 탭 전환 상태 (사용자 관리 vs 신고 관리)
    const [activeTab, setActiveTab] = useState<"users" | "reports">("users")
    const [reportedPosts] = useState(mockReportedPosts)
    const [reportedComments] = useState(mockReportedComments)

    const { authorizeUser, getNonuserList, getUserList, updateUserInfo, banUser } = useServices()

    const fetchData = useCallback(async () => {
        try {
            const users = await getUserList()
            const nonUsers = await getNonuserList()
            setUserList(users)
            setNonuserList(nonUsers)
        } catch (error) {
            console.error("데이터 가져오기 실패:", error)
        }
    }, [getUserList, getNonuserList])

    useEffect(() => {
        setTimeout(() => {
            fetchData()
            setLoading(false)
        }, 500)
    }, [fetchData])

    const formatRemainingTime = (bannedUntil: string): string => {
        const now = new Date().getTime()
        const banEndDate = new Date(bannedUntil).getTime()
        const diff = banEndDate - now
        if (diff <= 0) return "0"
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(hours / 24)
        const remainingHours = hours % 24
        if (hours < 1) return "1시간 이내"
        if (days < 1) return `${hours}시간`
        return `${days}일 ${remainingHours}시간`
    }

    // 사용자 승인/거부 처리
    const handleAccept = async (userId: string) => {
        try {
            await authorizeUser(userId, "accept")
            alert("사용자가 승인되었습니다.")
            await fetchData()
        } catch (error) {
            console.error("승인 실패:", error)
        }
    }

    const handleReject = async (userId: string) => {
        try {
            await authorizeUser(userId, "reject")
            alert("사용자가 거부되었습니다.")
            await fetchData()
        } catch (error) {
            console.error("거부 실패:", error)
        }
    }

    // UpdateModal 저장 시 처리
    const handleUpdateSave = async (updatedUser: UserEntity) => {
        try {
            await updateUserInfo(updatedUser.userId, updatedUser)
            alert("사용자 정보가 수정되었습니다.")
            setEditingUser(null)
            setEditMode(null)
            await fetchData()
        } catch (error) {
            console.error("수정 실패:", error)
        }
    }

    // BanModal 저장 시 처리
    const handleBanSave = async (days: number) => {
        if (!editingUser || days <= 0) {
            alert("유효한 정지 기간을 입력해 주세요.")
            return
        }
        try {
            await banUser(editingUser.userId, days)
            alert(`사용자가 ${days}일 정지되었습니다.`)
            setEditingUser(null)
            setEditMode(null)
            setBanDays(0)
            await fetchData()
        } catch (error) {
            console.error("정지 실패:", error)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="mt-4 text-gray-600 dark:text-gray-300 font-medium">잠시만 기다려주세요!</div>
            </div>
        )
    }

    return (
        <Container>
            <div className="max-w-7xl mx-auto">
                {/* Header & Tab Navigation */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center">
                        <Shield className="w-8 h-8 text-primary mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">관리자 페이지</h1>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-4">
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                                activeTab === "users"
                                    ? "bg-primary text-white"
                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            <span>사용자 관리</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("reports")}
                            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                                activeTab === "reports"
                                    ? "bg-primary text-white"
                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                            }`}
                        >
                            <Flag className="w-4 h-4" />
                            <span>신고 관리</span>
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="p-5 flex items-center">
                            <Users className="h-6 w-6 text-gray-400" />
                            <div className="ml-5">
                                <dt className="text-sm font-medium text-gray-500">총 사용자</dt>
                                <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">{userList.length}</dd>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="p-5 flex items-center">
                            <AlertTriangle className="h-6 w-6 text-yellow-400" />
                            <div className="ml-5">
                                <dt className="text-sm font-medium text-gray-500">승인 대기</dt>
                                <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">{nonuserList.length}</dd>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="p-5 flex items-center">
                            <Flag className="h-6 w-6 text-red-400" />
                            <div className="ml-5">
                                <dt className="text-sm font-medium text-gray-500">신고된 게시물</dt>
                                <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">{reportedPosts.length}</dd>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="p-5 flex items-center">
                            <MessageSquare className="h-6 w-6 text-red-400" />
                            <div className="ml-5">
                                <dt className="text-sm font-medium text-gray-500">신고된 댓글</dt>
                                <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">{reportedComments.length}</dd>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content */}
                <div className="mt-8">
                    {activeTab === "users" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* 가입된 사용자 */}
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                                        <Users className="w-5 h-5 mr-2" />
                                        가입된 사용자
                                    </h2>
                                    <div className="mt-4 overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    유저ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    작업
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {userList.map((user) => (
                                                <tr key={user.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {user.userId}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingUser({ ...user, password: null })
                                                                    setEditMode("update")
                                                                }}
                                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
                                                            >
                                                                <Edit className="w-4 h-4 mr-1" />
                                                                수정
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingUser({ ...user, password: null })
                                                                    setEditMode("ban")
                                                                }}
                                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
                                                            >
                                                                <Ban className="w-4 h-4 mr-1" />
                                                                정지
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                            {/* 가입 요청 사용자 */}
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                                        <AlertTriangle className="w-5 h-5 mr-2" />
                                        가입 요청 사용자
                                    </h2>
                                    <div className="mt-4 overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    유저ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    작업
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {nonuserList.map((nonuser) => {
                                                const remainingDays = nonuser.bannedUntil ? formatRemainingTime(nonuser.bannedUntil) : ""
                                                return (
                                                    <tr key={nonuser.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            <div className="flex items-center">
                                                                {nonuser.userId}
                                                                {!nonuser.isAuthorized && remainingDays && (
                                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                      {remainingDays}
                                    </span>
                                                                )}
                                                                {!nonuser.isAuthorized && !remainingDays && (
                                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                      NEW
                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleAccept(nonuser.userId)}
                                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300"
                                                                >
                                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                                    승인
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(nonuser.userId)}
                                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
                                                                >
                                                                    <X className="w-4 h-4 mr-1" />
                                                                    거부
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* 신고된 게시물 */}
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                                        <Flag className="w-5 h-5 mr-2" />
                                        신고된 게시물
                                    </h2>
                                    <div className="mt-4 space-y-4">
                                        {reportedPosts.map((post) => (
                                            <div key={post.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{post.title}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">작성자: {post.author}</p>
                                                    </div>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            {post.reportCount}회 신고됨
                          </span>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">주요 사유: {post.reason}</span>
                                                    <div className="flex space-x-2">
                                                        <button className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                                                            보기
                                                        </button>
                                                        <button className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300">
                                                            삭제
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                            {/* 신고된 댓글 */}
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                                        <MessageSquare className="w-5 h-5 mr-2" />
                                        신고된 댓글
                                    </h2>
                                    <div className="mt-4 space-y-4">
                                        {reportedComments.map((comment) => (
                                            <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-gray-900 dark:text-gray-100">{comment.content}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">작성자: {comment.author}</p>
                                                    </div>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            {comment.reportCount}회 신고됨
                          </span>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">주요 사유: {comment.reason}</span>
                                                    <div className="flex space-x-2">
                                                        <button className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                                                            보기
                                                        </button>
                                                        <button className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300">
                                                            삭제
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>

            {/* 모달: UpdateModal, BanModal (별도 컴포넌트 사용) */}
            <AnimatePresence>
                {editingUser && editMode === "update" && (
                    <UpdateModal
                        isOpen={true}
                        onClose={() => {
                            setEditingUser(null)
                            setEditMode(null)
                        }}
                        user={editingUser}
                        onSave={handleUpdateSave}
                    />
                )}
                {editingUser && editMode === "ban" && (
                    <BanModal
                        isOpen={true}
                        onClose={() => {
                            setEditingUser(null)
                            setEditMode(null)
                        }}
                        onSave={handleBanSave}
                        initialDays={banDays}
                    />
                )}
            </AnimatePresence>

            <CheerOverlay />
        </Container>
    )
}

export default Admin
