export const SYSTEM_MESSAGES = {
    CENSORSHIP_WARNING: {
        title: "SYSTEM WARNING",
        description: "※ 담당 연구원 및 현장탐사팀 직원의 열람을 금지합니다. 보안팀의 허가를 받은 후 해당 탐사기록에 접근해 주세요.",
    },
    SECURITY_VERIFICATION: {
        title: "보안 인증 필요 (Security Verification Required)",
        description: (level: string) => `※ 해당 기록의 전문을 열람하기 위해선 ${level}레벨 보안인증이 필요합니다.`,
    }
};
