"""Copy original documents into individual website downloads, grouped by work."""

import argparse
import hashlib
import json
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / "备用的资料包"
DOWNLOADS = ROOT / "docs/public/downloads"
INDEX = ROOT / "docs/.vitepress/theme/resources.js"

# Each item: title, original path (zip: prefix for an archive member), target,
# year label, and a short description. Original bytes and download names stay intact.
GROUPS = [
    ("training", "志愿培训", "准备培训课程与讲解资料。", [
        ("志愿者通识培训", "2024年_29th部门文件/新干事见面大会/志愿者通识培训ppt.pptx", "volunteer-introduction.pptx", "培训课件", "志愿者基础、注册、服务要求与志愿时长查询。"),
    ]),
    ("planning", "大会筹备", "策划、分工、物资与场地申请。", [
        ("新干事见面大会策划案", "2025新干事见面大会策划案....docx", "new-members-2025.docx", "2025 · 第 29 届", "参考活动安排、筹备分工与经费预算。"),
        ("总结暨聘书大会策划案", "2024年_29th部门文件/聘书大会/2025聘书大会策划案1.docx", "appointment-2025.docx", "2025", "参考聘书颁发、场地安排与大会筹备。"),
        ("报告厅申请表", "2024年_29th部门文件/新干事见面大会/2025深圳大学志愿者联合会报告厅申请表.docx", "venue-application-2025.docx", "2025", "参考活动场地申请的填写项目。"),
        ("见面暨聘书大会策划案", "2024年_29th部门文件/新干事见面大会/2024年深圳大学志愿者联合会新干事见面暨聘书颁发仪式策划案final.docx", "new-members-2024.docx", "2024 · 历史参考", "上一年度的整体策划参考。"),
    ]),
    ("execution", "现场执行", "主持、场内配合与流程衔接。", [
        ("新干事见面大会主持稿", "主持稿11.29版.pdf", "host-2025.pdf", "2025", "参考主持串词、颁发环节与现场提示。"),
        ("大会流程 · 第一场", "2024年_29th部门文件/新干事见面大会/2024大会流程第一场.pdf", "schedule-session-1.pdf", "2024 · 历史参考", "按环节查看第一场大会的执行顺序。"),
        ("大会流程 · 第二场", "2024年_29th部门文件/新干事见面大会/2024大会流程第二场.pdf", "schedule-session-2.pdf", "2024 · 历史参考", "按环节查看第二场大会的执行顺序。"),
        ("分会见面聘任大会主持稿", "2024年_29th部门文件/新干事见面大会/2024年深大志联.docx", "host-branches-2024.docx", "2024 · 历史参考", "可编辑的分会大会主持串词。"),
        ("第二场主持稿", "2024年_29th部门文件/新干事见面大会/主持稿第二场11.16.docx最终版.docx", "host-session-2.docx", "历史参考", "可编辑的第二场大会主持稿。"),
    ]),
    ("department", "部门日常", "工作交接、例会、招新与团建。", [
        ("部门工作交接目录", "2024年_29th部门文件/交接目录.docx", "department-handover.docx", "第 29 届", "了解各项工作职责及交接重点。"),
        ("培训部第一次例会记录", "2024年_29th部门文件/例会/深大志联培训部2025上学期第1次例会.docx", "meeting-2025.docx", "2025", "参考大会筹备、分组与例会记录方式。"),
        ("招新二面流程课件", "2024年28th招新二面ppt240919.pdf", "recruitment-2024.pdf", "2024 · 历史参考", "参考面试流程、分组任务与现场安排。"),
        ("二面演示课件", "二面.pptx", "recruitment-slides.pptx", "历史参考", "可编辑的二面现场演示资料。"),
        ("团建出游策划参考", "出游策划三选一.pdf", "team-outing.pdf", "历史参考", "比较出游方案，准备部门团建。"),
    ]),
    ("reimbursement", "活动报账", "按实际支出选择需要的表格与附件。", [
        ("经费报账表", "zip:经费报账表（活动结束后）.xlsx", "expenses.xlsx", "活动后", "填写活动信息、支出明细与分类合计。"),
        ("活动证明", "zip:活动证明（活动后）.docx", "activity-proof.docx", "活动后", "整理活动信息与现场照片。"),
        ("公务卡使用结算表", "zip:公务卡使用结算表.docx", "official-card.docx", "公务卡", "列出代付物资、付款时间与金额。"),
        ("奖品与慰问品签领表", "zip:奖品（慰问品）签领表.docx", "prize-receipts.docx", "物品发放", "记录领取物品与签领情况。"),
        ("劳务费发放表", "zip:劳务费/补贴 劳务费发放 （请注意学号和名字正确性）.xls", "labor-payment.xls", "劳务费", "填写学号、姓名、服务时间与金额。"),
        ("特殊情况说明", "zip:经费报销情况说明（特殊情况，如保险）.docx", "expense-explanation.docx", "特殊情况", "用于说明需要补充解释的支出。"),
        ("公对公转账明细示例", "zip:公对公转账 7A等 明细单/示例.pdf", "supplier-example.pdf", "票据示例", "参考商家物品明细的栏目。"),
        ("发票示例", "zip:发票/a1海报 ¥160.00.pdf", "invoice-example.pdf", "票据示例", "原活动海报采购的发票样例。"),
        ("发票说明", "zip:发票/发票说明.txt", "invoice-notes.txt", "历史说明", "原资料中的开票填写参考。"),
        ("劳务费填写提示", "zip:劳务费/注意.txt", "labor-notes.txt", "填写提示", "原资料中的姓名与学号核对提示。"),
    ]),
]


def build(check=False):
    groups = []
    copied = 0
    with zipfile.ZipFile(SOURCE / "活动报账（活动后）.zip") as archive:
        for group_id, title, description, items in GROUPS:
            group = {"id": group_id, "title": title, "description": description, "items": []}
            for label, original, target_name, year, detail in items:
                if original.startswith("zip:"):
                    member = "活动报账（活动后）/" + original[4:]
                    data = archive.read(member)
                    filename = Path(member).name
                else:
                    path = SOURCE / original
                    data = path.read_bytes()
                    filename = path.name
                target = DOWNLOADS / group_id / target_name
                if check:
                    if not target.is_file() or hashlib.sha256(target.read_bytes()).digest() != hashlib.sha256(data).digest():
                        raise ValueError("Original file mismatch: " + target_name)
                else:
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_bytes(data)
                size = f"{len(data) / 1024 / 1024:.1f} MB" if len(data) >= 1024 * 1024 else f"{max(1, round(len(data) / 1024))} KB"
                group["items"].append({
                    "title": label, "description": detail, "year": year,
                    "format": f"{target.suffix[1:].upper()} · {size}",
                    "link": f"/downloads/{group_id}/{target_name}", "filename": filename,
                })
                copied += 1
            groups.append(group)
    content = "// Generated by scripts/prepare_resources.py from original local files.\nexport const resourceGroups = " + json.dumps(groups, ensure_ascii=False, indent=2) + "\n"
    if check:
        if INDEX.read_text("utf8") != content:
            raise ValueError("Resource index is out of date")
    else:
        INDEX.write_text(content, encoding="utf8")
    print(json.dumps({"groups": len(groups), "original_files": copied, "check": check, "passed": True}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    build(parser.parse_args().check)
