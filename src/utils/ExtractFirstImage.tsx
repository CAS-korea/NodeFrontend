// utils/extractFirstImageUrl.ts
export const ExtractFirstImageUrl = (content: string): string => {
    // ① 마크다운 이미지
    const mdMatch = content.match(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/);
    if (mdMatch) return mdMatch[1];

    // ② HTML <img src="…">
    const htmlMatch = content.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/);
    if (htmlMatch) return htmlMatch[1];

    return "";
};

export default ExtractFirstImageUrl;