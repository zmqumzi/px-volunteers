"""Build the five-page printable field kit. No participant data is collected."""
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT.parent / 'output' / 'pdf' / 'PX志愿服务随身资料包.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
pdfmetrics.registerFont(TTFont('PX-CN', r'C:\Windows\Fonts\msyh.ttc', subfontIndex=0))
pdfmetrics.registerFont(TTFont('PX-CN-Bold', r'C:\Windows\Fonts\msyhbd.ttc', subfontIndex=0))
W, H = A4
M, CW = 42, W - 84
INK = colors.HexColor('#262626')
MUTED = colors.HexColor('#58616B')
LINE = colors.HexColor('#D6DBDE')
LIME = colors.HexColor('#B5ED35')
c = canvas.Canvas(str(OUT), pagesize=A4, pageCompression=1)
c.setTitle('PX 志愿服务随身资料包')
c.setAuthor('PX for Volunteers')
y = 0

def para(text, size=11, bold=False, color=INK, width=CW, x=M, gap=9):
    global y
    style = ParagraphStyle('px', fontName='PX-CN-Bold' if bold else 'PX-CN', fontSize=size,
                           leading=size * 1.6, textColor=color, wordWrap='CJK')
    p = Paragraph(escape(text), style)
    _, height = p.wrap(width, H)
    p.drawOn(c, x, y - height)
    y -= height + gap

def header(num, title, intro):
    global y
    c.setFillColor(LIME)
    c.rect(M, H - 91, CW, 3, fill=1, stroke=0)
    # Place the approved artwork within a PDF graphics viewport, preserving the source.
    logo_w, logo_h = 128, 128 * 428 / 1341
    bx, by = M, H - 78
    scale = logo_w / 1341
    c.saveState()
    crop = c.beginPath()
    crop.rect(bx, by, logo_w, logo_h)
    c.clipPath(crop, stroke=0)
    c.drawImage(str(ROOT / 'docs/public/images/px-a3-logo.png'),
                bx - 113 * scale, by - (941 - 110 - 428) * scale,
                width=1672 * scale, height=941 * scale)
    c.restoreState()
    c.setFillColor(MUTED)
    c.setFont('PX-CN', 9)
    c.drawRightString(W - M, H - 61, '随身资料包  /  %02d' % num)
    y = H - 112
    para(title, size=22, bold=True, gap=10)
    para(intro, size=10.5, color=MUTED, gap=16)

def section(title):
    global y
    y -= 5
    para(title, size=12, bold=True, gap=8)

def check(text):
    global y
    c.setStrokeColor(MUTED)
    c.setLineWidth(0.6)
    c.rect(M, y - 13, 8, 8, fill=0, stroke=1)
    para(text, width=CW - 20, x=M + 20, size=10.5, gap=7)

def fields(left, right):
    global y
    c.setFillColor(MUTED)
    c.setFont('PX-CN', 10)
    c.drawString(M, y - 12, left)
    c.drawString(M + CW / 2 + 10, y - 12, right)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.line(M, y - 27, M + CW / 2 - 10, y - 27)
    c.line(M + CW / 2 + 10, y - 27, W - M, y - 27)
    y -= 43

def writing(title, lines=2):
    global y
    para(title, size=10.5, bold=True, gap=0)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.5)
    for _ in range(lines):
        y -= 23
        c.line(M, y, W - M, y)
    y -= 13

def quote(text):
    global y
    style = ParagraphStyle('quote', fontName='PX-CN', fontSize=11, leading=18, textColor=INK, wordWrap='CJK')
    p = Paragraph(escape(text), style)
    _, height = p.wrap(CW - 28, H)
    c.setFillColor(colors.HexColor('#F5F7F1'))
    c.roundRect(M, y - height - 22, CW, height + 22, 7, fill=1, stroke=0)
    p.drawOn(c, M + 14, y - height - 11)
    y -= height + 36

def finish(num, source=None, url=None):
    if y < 140:
        raise RuntimeError('Body too close to footer on page %s: %s' % (num, y))
    c.setStrokeColor(LINE)
    c.setLineWidth(0.5)
    c.line(M, 110, W - M, 110)
    c.setFont('PX-CN', 8)
    c.setFillColor(MUTED)
    c.drawString(M, 94, source or '本站整理。请按实际项目补充；填写后的记录供工作使用。')
    if url:
        c.setFont('Helvetica', 7.5)
        c.drawString(M, 78, url)
        c.linkURL(url, (M, 75, W - M, 87), relative=0)
    c.setFont('PX-CN', 8)
    c.drawString(M, 51, 'PX for Volunteers  |  整理日期：2026-09-29')
    c.drawRightString(W - M, 51, '%s / 5' % num)
    c.showPage()

header(1, '服务前通用准备清单', '出发前核对安排，到场后确认分工，结束时完成交接。可单独打印本页。')
fields('项目名称', '服务日期 / 时段')
fields('集合地点', '当班负责人 / 联络渠道')
section('出发前')
for t in ['确认集合时间、地点、预计结束时间和到达路线。', '阅读项目说明，确认任务范围和需要预先学习的内容。', '保存负责人提供的联络方式，了解临时无法参加时的联系安排。', '按项目要求准备工作证、着装、饮水和所需物品。']:
    check(t)
section('到场后')
for t in ['完成签到，与负责人或搭档核对当天分工。', '熟悉工作区域、物品位置和交接地点。', '遇到安排差异或无法判断的问题时，先联系负责人员确认。']:
    check(t)
section('结束时')
for t in ['说明已完成与待处理事项，确认接班人员收到信息。', '清点并归还物品，按项目安排完成签退。', '记录有效的方法和需要改进的事项。']:
    check(t)
writing('需要补充或确认的事项', 2)
finish(1)

header(2, '专项服务准备清单', '在通用准备基础上，记录本次服务对象、沟通方式、场地和支持安排。')
fields('项目名称 / 日期', '本次具体任务')
fields('服务对象与需求', '现场支持人员 / 岗位')
section('需求与沟通')
for t in ['确认服务对象希望获得怎样的帮助。', '了解偏好的沟通方式，准备准确的地点、时间和文字提示。', '确认需要手语或其他沟通支持时，可以联系哪个岗位。']:
    check(t)
section('场地与路线')
for t in ['核对集合点、服务区、出入口及必要的无障碍路线。', '确认场地变化、天气变化或路线调整的联络方式。', '按项目要求准备物品，了解用品存放和归还位置。']:
    check(t)
section('分工与交接')
for t in ['明确自己可以处理的事项，以及需要转交的情况。', '确认搭档、交接时段和临时离开时的接替安排。']:
    check(t)
writing('待确认的问题 / 联系岗位 / 确认结果', 3)
finish(2)

header(3, '听障沟通参考', '先确认对方偏好的交流方式，再清楚表达并核对关键信息。')
section('先问怎样交流')
quote('你好，我是这里的志愿者。你希望我们用文字、口语，还是请熟悉手语的同学协助？')
section('交流时留意')
for t in ['确认对方已经注意到你，再开始说明。', '面对对方，清楚、自然地表达，给对方回应时间。', '环境嘈杂时，询问是否愿意移到较安静的位置。', '没有理解时，换一种说法，或写下关键内容。']:
    check(t)
section('把地点、时间和下一步写清楚')
quote('签到在入口右侧的咨询台。活动 14:00 开始。签到后，请按现场指引前往会场。')
para('这是一段可替换的示例。使用前核对实际地点、时间和安排。学习具体手语动作时，查阅规范资料与专业示范。', size=10.5, color=MUTED)
writing('本次活动的文字提示 / 沟通支持岗位', 3)
finish(3, '沟通建议参考 RNID；服务场景示例由本站整理。', 'https://rnid.org.uk/information-and-support/hearing-loss/communication-tips/')

header(4, '视障指引沟通参考', '介绍自己，询问需求；需要陪同的时候，由对方确认习惯的引导方式。')
section('开始前')
quote('你好，我是这里的志愿者。需要我帮你确认路线吗？你希望我怎样带你过去？')
section('陪同时')
for t in ['与服务对象本人交流，按已经确认的需求提供帮助。', '接近台阶或路缘时，提前说明位置和向上 / 向下的变化。', '说明前方障碍所在的位置，不仅用“那边”代替方向。', '到达后确认位置；离开时告知对方。']:
    check(t)
section('环境提示示例')
quote('前面有一级向上的台阶，我们先停一下。\n右前方有一张桌子，我先确认从哪侧经过更方便。')
para('根据现场已确认的信息调整用语。实际陪同行走、通过台阶与就座的技巧，结合原始资料中的专业示范学习。', size=10.5, color=MUTED)
writing('本次路线 / 环境变化 / 待确认事项', 3)
finish(4, '指引原则参考 RNIB；对话示例由本站整理。', 'https://www.rnib.org.uk/living-with-sight-loss/supporting-others/guiding-a-blind-or-partially-sighted-person/')

header(5, '志愿服务交接记录', '记录工作需要的信息。交接后，请接班人员确认待办事项与物品位置。')
fields('项目 / 工作区域', '交接日期 / 时段')
fields('交班岗位', '接班岗位')
writing('已完成的事项', 2)
writing('待处理的问题与下一步', 3)
writing('物品 / 资料位置与归还安排', 2)
writing('需要联系的岗位 / 联络方式', 2)
writing('接班确认 / 本次可改进的事项', 2)
finish(5, '本站整理。公开分享经验时，用岗位和场景说明，避免附上个人联系方式。')
c.save()
print(OUT)
