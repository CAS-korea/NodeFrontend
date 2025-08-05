"use client"

import React from "react"
import { marked } from "marked"
import DOMPurify from "dompurify"

interface MarkdownProcessorProps {
    content: string
}

const MarkdownProcessor: React.FC<MarkdownProcessorProps> = ({ content }) => {
    // processContent: DOMParser를 이용해 HTML을 파싱 후,
    // 첫 번째 텍스트 문단(이미지 문단 건너뜀)에서 첫 알파벳/숫자만 <span>으로 감쌉니다.
    const processContent = (html: string): string => {
        if (!html) return ""
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, "text/html")

        // 모든 <p> 태그 가져오기
        const paragraphs = Array.from(doc.querySelectorAll("p"))
        if (!paragraphs.length) return html

        // 이미지로만 구성된 문단은 건너뛰고, 텍스트가 포함된 첫 문단을 찾기
        let targetP: HTMLParagraphElement | null = null
        for (const p of paragraphs) {
            const hasTextNode = Array.from(p.childNodes).some(
                (node) =>
                    node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim() !== ""
            )
            if (hasTextNode) {
                targetP = p
                break
            }
        }
        if (!targetP) return html

        // targetP에서 첫 번째 텍스트 노드를 찾아 첫 글자(알파벳/숫자/한글)를 <span>으로 감싸기
        for (const node of targetP.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.nodeValue || ""
                // 유니코드 문자 또는 숫자
                const match = text.match(/[\p{L}\p{N}]/u)
                if (match) {
                    const index = match.index || 0
                    const firstChar = text[index]
                    const before = text.slice(0, index)
                    const after = text.slice(index + 1)

                    const span = doc.createElement("span")
                    span.className =
                        "float-left text-5xl font-serif leading-none mr-2 mt-1"
                    span.textContent = firstChar

                    const beforeNode = doc.createTextNode(before)
                    const afterNode = doc.createTextNode(after)

                    targetP.insertBefore(beforeNode, node)
                    targetP.insertBefore(span, node)
                    targetP.insertBefore(afterNode, node)
                    targetP.removeChild(node)
                    break
                }
            }
        }

        // 추가 스타일링: 헤딩, 코드 블록, 목록, 테이블 등
        const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6")
        headings.forEach((heading) => {
            if (heading.tagName === "H1") {
                heading.classList.add("text-3xl", "font-bold", "mt-6", "mb-4")
            } else if (heading.tagName === "H2") {
                heading.classList.add("text-2xl", "font-bold", "mt-5", "mb-3")
            } else {
                heading.classList.add("text-xl", "font-semibold", "mt-4", "mb-2")
            }
        })

        const preBlocks = doc.querySelectorAll("pre")
        preBlocks.forEach((pre) => {
            pre.classList.add(
                "bg-gray-100",
                "dark:bg-gray-800",
                "p-4",
                "rounded-md",
                "overflow-x-auto",
                "my-4"
            )
            const codeElement = pre.querySelector("code")
            if (codeElement) {
                codeElement.classList.add("text-sm", "font-mono")
            }
        })

        const lists = doc.querySelectorAll("ul, ol")
        lists.forEach((list) => {
            list.classList.add("my-4", "pl-5")
            const items = list.querySelectorAll("li")
            items.forEach((item) => {
                item.classList.add("mb-2", "pl-1")
                if (list.tagName === "UL") {
                    item.classList.add("list-disc", "marker:text-blue-500")
                } else {
                    item.classList.add("list-decimal", "marker:text-blue-500")
                }
            })
        })

        const tables = doc.querySelectorAll("table")
        tables.forEach((table) => {
            table.classList.add("w-full", "border-collapse", "my-4")
            table.style.borderSpacing = "0"
            const cells = table.querySelectorAll("th, td")
            cells.forEach((cell) => {
                cell.classList.add(
                    "border",
                    "border-gray-300",
                    "dark:border-gray-700",
                    "px-4",
                    "py-2"
                )
            })
            const headerCells = table.querySelectorAll("th")
            headerCells.forEach((th) => {
                th.classList.add("bg-gray-100", "dark:bg-gray-800", "font-semibold")
            })
        })

        return doc.body.innerHTML
    }

    // 마크다운 옵션 설정
    marked.setOptions({
        gfm: true,
        breaks: true,
    })

    // 1) 마크다운 → HTML 변환
    const rawHtml = marked.parse(content) as string
    // 2) DOMPurify로 HTML 정제 (XSS 및 불필요한 태그 제거)
    const safeHtml = DOMPurify.sanitize(rawHtml)
    // 3) DOMParser로 첫 글자 래핑 등 추가 스타일 적용
    const processedHtml = processContent(safeHtml)

    return (
        <div
            className="prose prose-stone dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
    )
}

export default MarkdownProcessor
