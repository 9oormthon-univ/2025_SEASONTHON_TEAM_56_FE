## Locally - AI 문장형 상품 추천 플랫폼
<div align="center">

<br/>
<br/>
<p><strong>"문장으로 찾는 나만의 상품"</strong></p>
<p>사용자의 자연어(문장) 입력을 AI가 분석하여, 숨겨진 로컬 브랜드 및 스타트업의 상품을 취향에 맞게 추천해주는 지능형 커머스 플랫폼입니다.</p>
</div>

<br/>

✨ 프로젝트 컨셉 (Project Concept)
대형 쇼핑몰의 정형화된 상품 추천에서 벗어나, 사용자의 감성과 상황이 담긴 **'문장'**을 통해 **'발견의 즐거움'**을 제공하고자 합니다. "여자친구에게 줄 선물을 추천해줘"와 같은 단순 검색을 넘어, "일 때문에 지친 여자친구를 위로해줄 아기자기하고 향긋한 선물을 찾고 있어"와 같은 구체적인 문장을 AI가 이해하고 최적의 상품을 찾아줍니다.

이를 통해 잠재력 있는 소상공인과 스타트업에게는 새로운 고객을 만날 기회를, 소비자에게는 자신만의 스토리가 담긴 상품을 발견하는 특별한 경험을 선사합니다.

<br/>

🚀 핵심 기능 (Key Features)
💬 AI 문장형 상품 검색: 사용자가 입력한 문장의 의도를 AI가 분석하여 맞춤 상품 목록을 추천합니다.

🏷️ 키워드 기반 상세 검색: 사용자가 직접 키워드를 추가하여 추천 결과를 더욱 정교하게 필터링할 수 있습니다.

🤖 AI 상세 설명 생성: 판매자가 상품명, 특징 등 핵심 정보만 입력하면 AI가 매력적인 상세 설명 초안을 자동으로 생성해줍니다.

🛍️ 상품 등록 및 관리: 판매자가 자신의 상품 정보와 이미지를 손쉽게 등록하고 관리할 수 있는 기능을 제공합니다.

🖼️ 이미지 업로드: 드래그 앤 드롭을 지원하는 편리한 UI를 통해 여러 장의 이미지를 업로드할 수 있습니다.

📄 상품 상세 정보 조회: 추천된 상품을 클릭하여 상세 정보, 이미지, 가격 등을 확인할 수 있습니다.

<br/>

🛠️ 기술 스택 (Tech Stack)
구분	기술
Frontend	Next.js, JavaScript, Tailwind CSS, shadcn/ui, Lottie
Backend	Spring Boot, Java
Infra & DevOps	AWS S3, Git, GitHub, GitHub Actions, Vercel

Sheets로 내보내기
<br/>

🏗️ 아키텍처 (Architecture)
본 프로젝트는 프론트엔드와 백엔드가 명확히 분리된 MSA (Microservice Architecture) 구조를 지향합니다.

Frontend (Next.js on Vercel): 사용자에게 보여지는 모든 UI와 사용자 경험을 담당합니다.

Backend (Spring Boot on AWS EC2/EKS): 비즈니스 로직, 데이터베이스 관리, 외부 AI 모델 연동 등 핵심 로직을 처리합니다.

Image Storage (AWS S3): 이미지와 같은 정적 파일은 S3 Presigned URL 방식을 통해 처리합니다. 프론트엔드가 백엔드로부터 임시 업로드 허가를 받아 S3에 직접 파일을 전송함으로써, 백엔드 서버의 부하를 최소화하고 안정성과 확장성을 확보합니다.

## 서비스 화면
<img width="3944" height="2564" alt="Image" src="https://github.com/user-attachments/assets/63735845-16ab-4b18-962a-61ee5056651f" />
<img width="3944" height="2564" alt="Image" src="https://github.com/user-attachments/assets/0e836f88-33f3-41d2-bee9-1532b9bce70a" />
<img width="3944" height="2564" alt="Image" src="https://github.com/user-attachments/assets/02c49930-30d8-4d42-b714-6e7953b6a1a7" />
<img width="3944" height="2564" alt="Image" src="https://github.com/user-attachments/assets/0a6bd108-dd3c-4261-bdc9-69ee5c1f1d98" />




