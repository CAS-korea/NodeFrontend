import {Link} from "react-router-dom";
import {ClientUrl} from "../../constants/ClientUrl.ts"; // 서비스 훅 불러오기
import {useState} from "react";
import {motion} from "framer-motion";
import {useServices} from "../../context/ServicesProvider";
import FloatingInput from "../../components/FloatingInput";

const Login: React.FC = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {login} = useServices();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const loginDTO = { userId, password };

        try {
            await login(loginDTO);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("알 수 없는 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // 외부 컨테이너: 세로(column) 배치이지만 md 이상에서 좌우(row) 배치로 전환
        <div className="min-h-screen flex flex-col md:flex-row ">
            {/*
              (1) md ~ <lg 구간에서만 표시될 왼쪽 영역
              - <md 구간: hidden
              - md ~ <lg 구간: flex
              - >= lg 구간: hidden
            */}
            <motion.div
                className="hidden md:flex lg:hidden md:flex-1 md:items-center md:justify-center p-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-md">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900">연결의 미학, 노드</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        노드에서 새로운 감각의 소통과 예술적 연결을 경험해보세요.
                        <br />
                        학술 교류와 협업 기회를 통해 지식을 나누고 함께 성장할 수 있습니다.
                    </p>
                    <Link to={ClientUrl.REGISTER}>
                        <motion.span
                            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            회원가입 하기
                        </motion.span>
                    </Link>
                </div>
            </motion.div>

            {/*
              (2) 오른쪽 영역: 로그인 폼
              - 모든 화면에서 표시되나, 레이아웃은 md 이상에서 좌우 분할
            */}
            <motion.div
                className="flex-1 flex items-center justify-center  p-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">로그인</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FloatingInput
                            label="UserID"
                            name="id"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                        <FloatingInput
                            label="Password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && (
                            <motion.p
                                className="text-red-500 text-sm text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {error}
                            </motion.p>
                        )}

                        <div className="flex justify-end">
                            <Link to={ClientUrl.FORGOT} className="text-sm text-gray-600 hover:text-gray-900">
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="focus:outline-none"
                                >
                                    비밀번호를 잊으셨나요?
                                </motion.button>
                            </Link>
                        </div>

                        <motion.button
                            type="submit"
                            className="w-full py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? "로그인 중..." : "로그인"}
                        </motion.button>
                    </form>

                    {/*
                      (A) 작은 화면(<md): 회원가입 버튼을 폼 아래에 표시
                    */}
                    <div className="block md:hidden text-center mt-6">
                        <Link
                            to={ClientUrl.REGISTER}
                            className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
                        >
                            회원가입 하기
                        </Link>
                    </div>

                    {/*
                      (B) 큰 화면(lg 이상): 왼쪽 영역을 숨기는 대신, 회원가입 버튼을 다시 폼 아래에 표시
                    */}
                    <div className="hidden lg:block text-center mt-6">
                        <Link
                            to={ClientUrl.REGISTER}
                            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
                        >
                            회원가입 하기
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
