import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useServices } from "../../context/ServicesProvider";
import { UserEntity, UserRole } from "../../types/UserEntity.ts";
import { ClientUrl } from "../../constants/ClientUrl.ts";
import FloatingInput from "../../components/FloatingInput";

const isIdValid = (id: string) => /^[A-Za-z0-9]{5,}$/.test(id);
const isPasswordValid = (password: string) =>
    /^(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$*]{8,}$/.test(password);
const isNameValid = (name: string) => /^[A-Za-z가-힣]+$/.test(name);
const isPhoneNumberValid = (phoneNumber: string) => /^[0-9]{11}$/.test(phoneNumber);
const isStudentNumberValid = (studentNumber: string) => /^[0-9]{8}$/.test(studentNumber);
const isEmailValid = (email: string) => /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/.test(email);

const Register: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [studentNumber, setStudentNumber] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<UserRole>("STUDENT");
    const [confirmPassword, setConfirmPassword] = useState("");

    // 엔티티 필드로 필요하면 빈 문자열로 제출
    const profileImageUrl = "";

    const [loading, setLoading] = useState(false);
    // ⛔ uploadImage 제거
    const { register, duplicate } = useServices();
    const [isIdChecked, setIsIdChecked] = useState(false);

    const [errors, setErrors] = useState({
        userId: "",
        name: "",
        phoneNumber: "",
        studentNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const checkUserIdDuplicate = async () => {
        if (!isIdValid(userId)) {
            setErrors((prev) => ({
                ...prev,
                userId: "영어와 숫자로만 이루어진 5자 이상의 ID를 입력해주세요.",
            }));
            return;
        }
        setLoading(true);
        try {
            if (await duplicate(userId)) {
                setErrors((prev) => ({
                    ...prev,
                    userId: "이미 사용 중인 ID입니다. 다른 ID를 입력해주세요.",
                }));
                setIsIdChecked(false);
            } else {
                setErrors((prev) => ({ ...prev, userId: "" }));
                setIsIdChecked(true);
            }
        } catch (error) {
            console.error("ID 중복 확인 실패", error);
            setErrors((prev) => ({
                ...prev,
                userId: "ID 확인 중 오류가 발생했습니다.",
            }));
            setIsIdChecked(false);
        }
        setLoading(false);
    };

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep === 1) {
            const newErrors = {
                userId: "",
                name: "",
                phoneNumber: "",
                studentNumber: "",
                email: "",
                password: "",
                confirmPassword: "",
            };
            let hasError = false;

            if (!userId.trim()) {
                newErrors.userId = "UserID가 채워지지 않았습니다.";
                hasError = true;
            } else if (!isIdChecked) {
                newErrors.userId = "ID 중복 확인을 완료해주세요.";
                hasError = true;
            }
            if (!name.trim()) {
                newErrors.name = "이름이 채워지지 않았습니다.";
                hasError = true;
            } else if (!isNameValid(name)) {
                newErrors.name = "이름은 한글 혹은 영어로만 구성되어야 합니다.";
                hasError = true;
            }
            if (!phoneNumber.trim()) {
                newErrors.phoneNumber = "전화번호가 채워지지 않았습니다.";
                hasError = true;
            } else if (!isPhoneNumberValid(phoneNumber)) {
                newErrors.phoneNumber = "전화번호는 숫자 11자리여야 합니다.";
                hasError = true;
            }
            if (!studentNumber.trim()) {
                newErrors.studentNumber = "학번이 채워지지 않았습니다.";
                hasError = true;
            } else if (!isStudentNumberValid(studentNumber)) {
                newErrors.studentNumber = "학번은 숫자 8자리여야 합니다.";
                hasError = true;
            }
            if (!email.trim()) {
                newErrors.email = "이메일이 채워지지 않았습니다.";
                hasError = true;
            } else if (!isEmailValid(email)) {
                newErrors.email = "유효한 이메일 형식을 입력해주세요.";
                hasError = true;
            }
            if (!password.trim()) {
                newErrors.password = "비밀번호가 채워지지 않았습니다.";
                hasError = true;
            } else if (!isPasswordValid(password)) {
                newErrors.password = "비밀번호는 8자 이상이며, 소문자와 숫자를 포함해야 합니다.";
                hasError = true;
            }
            if (!confirmPassword.trim()) {
                newErrors.confirmPassword = "비밀번호가 채워지지 않았습니다.";
                hasError = true;
            } else if (password !== confirmPassword) {
                newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
                hasError = true;
            }

            if (hasError) {
                setErrors(newErrors);
                return;
            }
            setErrors(newErrors);
            setCurrentStep(currentStep + 1);
        } else if (currentStep === 2) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleFinalSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
        if (e) e.preventDefault();

        const newErrors = { ...errors };
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
            setErrors(newErrors);
            return;
        }
        setErrors(newErrors);
        setLoading(true);

        const userEntity: UserEntity = {
            userId,
            password,
            name,
            phoneNumber,
            studentNumber,
            email,
            role,
            isAuthorized: false,
            introduce: "",
            profileImageUrl, // 빈 문자열 제출
            bannedUntil: "",
        };

        try {
            await register(userEntity);
            // TODO: navigate or toast
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="flex-grow">
                                <FloatingInput
                                    label="UserID"
                                    name="Userid"
                                    value={userId}
                                    onChange={(e) => {
                                        setUserId(e.target.value);
                                        setIsIdChecked(false);
                                    }}
                                    error={errors.userId}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={checkUserIdDuplicate}
                                className={`ml-2 px-4 py-2 rounded-lg text-white text-sm ${
                                    isIdChecked ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"
                                }`}
                                disabled={loading}
                            >
                                {isIdChecked ? "사용 가능" : "중복 확인"}
                            </button>
                        </div>
                        <FloatingInput
                            label="이름"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={errors.name}
                        />
                        <FloatingInput
                            label="전화번호"
                            name="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            error={errors.phoneNumber}
                        />
                        <FloatingInput
                            label="학번"
                            name="studentNumber"
                            value={studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
                            error={errors.studentNumber}
                        />
                        <FloatingInput
                            label="이메일"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                        />
                        <FloatingInput
                            label="비밀번호"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                        />
                        <FloatingInput
                            label="비밀번호 재입력"
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={errors.confirmPassword}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col items-center space-y-6">
                        <p className="text-lg font-medium text-gray-700">회원 유형 선택</p>
                        <div className="flex justify-center space-x-6">
                            <motion.button
                                type="button"
                                onClick={() => setRole("STUDENT")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-5 py-2 rounded-full transition-colors ${
                                    role === "STUDENT" ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-800"
                                }`}
                                disabled={loading}
                            >
                                재학생
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={() => setRole("GRADUATE")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-5 py-2 rounded-full transition-colors ${
                                    role === "GRADUATE" ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-800"
                                }`}
                                disabled={loading}
                            >
                                졸업생
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={() => setRole("PROFESSOR")}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-5 py-2 rounded-full transition-colors ${
                                    role === "PROFESSOR" ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-800"
                                }`}
                                disabled={loading}
                            >
                                교수
                            </motion.button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="flex flex-col items-center text-center space-y-6">
                        <motion.h2
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-3xl font-bold text-gray-900"
                        >
                            Welcome to Node!
                        </motion.h2>
                        <p className="text-gray-600">
                            회원가입을 완료하려면 아래 버튼을 눌러주세요.
                        </p>

                        <motion.button
                            type="button"
                            onClick={handleFinalSubmit}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                        >
                            {loading ? "가입 중..." : "Enter"}
                        </motion.button>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderNavigation = () => {
        if (currentStep === 3) return null; // Step3에선 큰 CTA만

        return (
            <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                    <motion.button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-gray-600 hover:text-gray-900"
                        disabled={loading}
                    >
                        이전
                    </motion.button>
                )}

                <motion.button
                    type="button"
                    onClick={handleNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
                    disabled={loading}
                >
                    다음
                </motion.button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">회원가입</h1>

                <div className="mb-8">
                    <div className="h-1 bg-gray-200 rounded-full">
                        <motion.div
                            className="h-full bg-gray-900 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(currentStep / 3) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {renderStepContent()}
                    </motion.div>

                    {renderNavigation()}
                </form>

                <motion.div whileTap={{ scale: 0.95 }} className="mt-6 text-center">
                    <Link to={ClientUrl.LOGIN} className="text-gray-600 hover:text-gray-800">
                        이미 계정이 있으신가요? 로그인하기
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register;

/* =========================================================================
   🔒 Archived (previous Step 3 & image-upload handlers)
   - 필요 시 복구해서 쓰세요. 현재 컴포넌트에서는 참조하지 않습니다.
   ========================================================================

  // State
  // const [profileImage, setProfileImage] = useState<File | null>(null);
  // const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  // const [imageUploading, setImageUploading] = useState(false);

  // Services
  // const { register, duplicate, uploadImage } = useServices();

  // Handlers
  // const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setProfileImage(file);
  //     setImageUploading(true);
  //     try {
  //       const url = await uploadImage(file);
  //       setProfileImageUrl(url);
  //     } catch (error) {
  //       console.error("이미지 업로드 실패: ", error);
  //     } finally {
  //       setImageUploading(false);
  //     }
  //   }
  // };

  // const handleRemoveImage = () => {
  //   setProfileImage(null);
  //   setProfileImageUrl("");
  // };

  // (old Step 3)
  // <div className="flex flex-col items-center space-y-6">
  //   <p className="text-lg font-medium text-gray-700">프로필 사진 첨부</p>
  //   <label
  //     className={`cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 ${
  //       imageUploading ? 'opacity-50 cursor-not-allowed' : ''
  //     }`}
  //   >
  //     프로필 사진 선택
  //     <input
  //       type="file"
  //       accept="image/*"
  //       className="hidden"
  //       onChange={handleProfileImageChange}
  //       disabled={imageUploading}
  //     />
  //   </label>
  //   {imageUploading && <p>Uploading image...</p>}
  //   {profileImage && (
  //     <div className="relative">
  //       <img
  //         src={URL.createObjectURL(profileImage)}
  //         alt="미리보기"
  //         className="w-24 h-24 object-cover rounded-full border"
  //       />
  //       <button
  //         type="button"
  //         onClick={handleRemoveImage}
  //         className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm"
  //       >
  //         ✕
  //       </button>
  //     </div>
  //   )}
  // </div>

*/
