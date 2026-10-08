# Git & GitHub 정리

## 목차

1. [Git / GitHub](#1-git--github)
   - [Git & GitHub를 사용해야 하는 이유](#11-git--github를-사용해야-하는-이유)
   - [Git과 GitHub의 차이](#12-git과-github의-차이)
   - [Repository](#13-repository레포지토리)
   - [Commit](#14-commit커밋)
   - [Branch](#15-branch브랜치)
2. [git 기본 명령어](#2-git-기본-명령어)
   - [git config](#21-git-config) · [git init](#22-git-init) · [git status](#23-git-status) · [git add](#24-git-add) · [git commit](#25-git-commit) · [git push](#26-git-push) · [git pull](#27-git-pull)
3. [Branch](#3-branch)
   - [git branch 명령어](#31-git-branch-명령어)
   - [브랜치 관리 전략](#32-브랜치-관리-전략-main-develop-feature-hotfix-release)
   - [Fast-forward](#33-fast-forward)
   - [3-way merge](#34-3-way-merge)
   - [Merge conflict](#35-merge-conflict)
4. [GitHub 실습](#4-github-실습)
   - [원격 저장소 만들고 연결 및 Push 하기](#41-원격-저장소-만들고-연결-및-push-하기)
   - [기본 브랜치를 main으로 설정하는 법](#42-기본-브랜치를-main으로-설정하는-법)
   - [README 만들고 로컬에 반영하기](#43-readme-만들고-로컬에-반영하기)
   - [Issue 생성 및 처리](#44-issue-생성-및-처리)
   - [다른 레포지토리 가져오기 (Clone)](#45-다른-레포지토리-가져오기-clone)

---

## 1. Git / GitHub

### 1.1 Git & GitHub를 사용해야 하는 이유

**버전 관리(Version Control)** 란 파일이나 코드의 변경 이력을 체계적으로 기록하고 관리하는 것.  
언제, 누가, 무엇을 바꿨는지 알 수 있고, 필요하면 과거 상태로 되돌릴 수 있다.

| 이유 | 설명 |
| --- | --- |
| **버전 관리** | 코드의 변경 이력을 기록·추적. 특정 버그가 언제 생겼는지 찾을 수 있고, 잘못 수정했더라도 이전 정상 버전으로 바로 되돌릴 수 있다. |
| **협업** | 여러 명이 각자의 브랜치에서 동시에 작업한 뒤 병합(merge). 같은 파일을 수정해도 누가 무엇을 바꿨는지 확인하고 충돌을 해결할 수 있으며, 코드 리뷰로 피드백을 주고받는다. |
| **백업·중앙 저장소** (GitHub) | 클라우드에 코드가 저장되어 언제 어디서든 접근할 수 있고, 내 컴퓨터가 고장 나도 데이터가 남아 있다. |
| **오픈 소스·공유** (GitHub) | 누구나 오픈 소스 프로젝트에 기여할 수 있고, 내 프로젝트를 공개해 피드백을 받을 수 있다. |

**파일 복사 방식과 비교**

| 파일 복사 방식 | Git 사용 |
| --- | --- |
| `final.py`, `final_v2.py`, `진짜최종.py`처럼 파일이 늘어남 | 변경 내용이 커밋 단위로 기록됨 |
| 변경 이유와 내용이 남지 않음 | 언제든 특정 시점으로 되돌릴 수 있음 |
| 어떤 파일이 최신인지 알기 어려움 | 여러 사람이 동시에 작업 가능 |
| | 변경 이력과 책임이 명확함 |

### 1.2 Git과 GitHub의 차이

| | Git | GitHub |
| --- | --- | --- |
| 정체 | 버전 관리를 위한 **도구(프로그램)** | Git 저장소를 올려두는 **웹 서비스** |
| 동작 위치 | 내 컴퓨터(로컬) | 인터넷(원격 서버) |
| 역할 | 변경 이력 기록, 브랜치, 병합 | 코드 공유·백업, 협업 플랫폼 |
| 주요 기능 | commit, branch, merge 등 | Pull Request, Issue, Code Review |

> **Git은 버전 관리 엔진, GitHub는 협업과 공유를 위한 서비스** 
> Git은 GitHub 없이도 쓸 수 있지만, GitHub는 Git 저장소를 전제로 한다.

### 1.3 Repository(레포지토리)

파일과 그 변경 이력을 함께 관리하는 **저장소**. 프로젝트 전체와 모든 버전 기록이 들어 있다.

- **로컬 저장소** : 내 컴퓨터에 있는 저장소
  - 프로젝트 폴더로 이동한 뒤 `git init`을 실행하면 그 폴더가 Git 레포지토리가 된다.
- **원격 저장소** : GitHub 같은 서버에 있는 저장소
  - GitHub에서 새 Repository를 만들고 `git clone`으로 내 컴퓨터에 복사
  - 여러 사람이 같은 코드를 공유하는 협업의 기준점이자 백업 역할을 한다.

```bash
git remote add origin 원격주소      # 로컬 저장소에 원격 저장소 연결
git remote -v                     # 연결된 원격 저장소 확인
```

**작업 공간 3단계**

```text
Working Directory  ──git add──▶  Staging Area  ──git commit──▶  Repository
 (파일을 수정하는 곳)            (커밋할 변경을 모으는 곳)        (버전이 기록되는 곳)
```

- **Working Directory** : 실제로 파일을 수정하는 공간. 아직 Git에 기록되지 않은 변경이 있는 상태
- **Staging Area** : 다음 커밋에 포함할 변경 사항을 미리 골라 모아두는 공간
- **HEAD** : 현재 내가 작업 중인 위치를 가리키는 포인터. 보통 현재 브랜치의 최신 커밋을 가리킨다.

### 1.4 Commit(커밋)

변경 사항을 하나의 기록으로 저장하는 단위, 즉 **하나의 버전**

- "무엇을 왜 바꿨는지"를 메시지로 남김
- 특정 시점의 프로젝트 상태를 저장
- 되돌아갈 수 있는 기준점 역할(게임의 세이브 파일과 비슷)

```bash
git commit -m "회원가입 기능 추가"
```

**커밋 메시지 작성 규칙** — 무엇을 했는지 한눈에 알 수 있어야 한다.

- 명확하고 간결하게 작성
- 동사로 시작
- 한 커밋 = 한 작업
- 예: `Add login API`, `Fix password validation bug`, `Refactor user service`

### 1.5 Branch(브랜치)

기존 작업과 분리되어 **독립적으로 작업할 수 있는 공간**

- 기존 코드를 건드리지 않고 기능을 개발할 수 있다.
- 여러 기능을 동시에 개발할 수 있다.
- 작업이 끝나면 병합(merge)한다.

```bash
git branch feature/login    # 브랜치 생성
git switch feature/login    # 브랜치 전환
```

---

## 2. git 기본 명령어

**전체 흐름**

```text
git config → git init → (파일 수정) → git status → git add → git commit → git push
                                                                        ↑
                                                         git pull (원격 변경 받아오기)
```

### 2.1 git config

Git의 기본 동작을 설정하는 명령어로 커밋에 기록될 작성자 정보를 가장 먼저 설정한다.

```bash
# 전역 설정: 내 컴퓨터의 모든 저장소에 적용
git config --global user.name "홍길동"
git config --global user.email "hong@example.com"

# 로컬 설정: 현재 저장소에만 적용 (회사/개인 프로젝트 계정을 구분할 때)
git config user.name "홍길동"
git config user.email "hong@example.com"

# 설정 확인
git config --list             # 전체 설정 출력
git config --get user.name    # 특정 항목만 출력
```

### 2.2 git init

현재 폴더를 Git 레포지토리로 초기화

```bash
git init
```

- `.git` 폴더가 생성된다. (버전 기록이 모두 이 안에 저장됨)
- 현재 폴더를 기준으로 버전 관리 시작
- 이미 GitHub에 있는 저장소를 가져올 때는 `git init` 대신 `git clone [원격저장소 URL]`을 사용

### 2.3 git status

현재 레포지토리의 상태를 확인. 수정된 파일, 스테이징 여부, 커밋 가능한 변경 사항을 알려 준다.

```bash
git status       # 저장소의 현재 상태 출력
git status -s    # 간략하게 표시
```

### 2.4 git add

변경된 파일을 **Staging Area**로 올린다. 커밋에 포함할 변경을 선택하는 단계이며, 아직 커밋이 만들어진 것은 아니다.

```bash
git add 파일명             # 특정 파일만 스테이징
git add 디렉토리명          # 해당 디렉토리의 변경 파일 전체 스테이징
git add .                # 현재 폴더 아래의 변경 파일 전체 스테이징
```

> `.gitignore` 파일에 적은 대상(`.env`, `__pycache__/`, `*.log` 등)은 `git add`에서 제외된다. 이미 커밋된 파일은 계속 추적되므로 `git rm --cached 파일명`으로 추적을 해제해야 한다.

### 2.5 git commit

Staging Area에 있는 변경 사항을 하나의 버전으로 기록.

```bash
git commit -m "커밋 메시지"            # 메시지와 함께 커밋
git commit -am "커밋 메시지"           # 이미 추적 중인 파일의 add + commit을 한 번에
git commit --amend                  # 마지막 커밋 수정 (메시지·파일)
git commit --amend --no-edit        # 메시지는 그대로 두고 마지막 커밋 수정
```

커밋 이력은 `git log`로 확인합니다.

```bash
git log                     # 커밋 이력 출력
git log --oneline --graph   # 한 줄 + 그래프 형태로 출력
```

### 2.6 git push

**로컬 커밋을 원격 저장소로 올리는** 명령어.

```bash
git push -u origin main     # 처음 올릴 때: origin의 main과 연결(-u)하며 업로드
git push                    # 이후에는 이것만으로 충분
git push origin feature/ui  # 특정 브랜치 올리기
```

### 2.7 git pull

**원격 저장소의 변경 사항을 내려받아 로컬에 반영하는** 명령어. (내려받기 `fetch` + 병합 `merge`)

```bash
git pull                    # 연결된 원격 브랜치의 변경 사항 받기
git pull origin main        # origin의 main을 받아 현재 브랜치에 병합
```

> 다른 사람이 원격 저장소를 먼저 변경했다면 `git push`가 거절된다. `git pull`로 최신 내용을 받은 뒤 다시 `git push` 하면 된다.

---

## 3. Branch

### 3.1 git branch 명령어

| 명령어 | 설명 |
| --- | --- |
| `git branch` | 브랜치 목록 확인 (현재 브랜치에 `*` 표시) |
| `git branch [이름]` | 브랜치 생성 |
| `git switch [이름]` | 브랜치 전환 |
| `git switch -c [이름]` | 브랜치 생성과 동시에 전환 |
| `git branch -m [이름] [새 이름]` | 브랜치 이름 변경 |
| `git branch -d [이름]` | 브랜치 삭제 |
| `git merge [이름]` | 해당 브랜치의 작업 내용을 **현재 브랜치**로 병합 |
| `git checkout [이름]` | 브랜치 전환 (예전 방식) |
| `git checkout -b [이름]` | 브랜치 생성과 동시에 전환 (예전 방식) |

```bash
git branch feature/ui     # 생성
git switch feature/ui     # 전환
# ... 작업 후 커밋 ...
git switch main           # main으로 돌아와서
git merge feature/ui      # feature/ui를 main에 병합
```

### 3.2 브랜치 관리 전략 (main, develop, feature, hotfix, release)

브랜치 관리 전략은 **어떻게 브랜치를 나누고 합칠지에 대한 팀의 약속**이며, 협업과 안정적인 배포를 위해 필요하다.

| 브랜치 | 역할 | 분기 출발점 | 병합 대상 |
| --- | --- | --- | --- |
| `main` | 배포 가능한 **안정 버전** | — | — |
| `develop` (`dev`) | 개발 중인 기능을 모아 테스트하는 버전 | `main` | `release` → `main` |
| `feature/*` | 기능 하나를 개발 (예: `feature/login`) | `develop` | `develop` |
| `release/*` | 배포 직전 최종 점검·버그 수정 | `develop` | `main`, `develop` |
| `hotfix/*` | 배포된 버전의 **긴급 수정** | `main` | `main`, `develop` |

```text
main     ●───────────────────────●───────────●   (배포)
          \                     /  \         /
hotfix     \                   /    ●───────●     (긴급 수정)
            \                 /              \
release      \           ●───●                \
              \         /     \                \
develop        ●───●───●───────●────────────────●
                    \     /
feature              ●───●                        (기능 개발)
```

### 3.3 Fast-forward

**브랜치가 직선으로 이어질 때** 일어나는 병합. `main`에서 브랜치를 만든 뒤 `main`에 새 커밋이 없었다면, `main`의 포인터만 앞으로 옮기면 된다. **병합 커밋이 생기지 않습니다.**

```text
병합 전                          병합 후 (git merge feature/ui)

main                                           main
 ↓                                              ↓
 ●───●───●  feature/ui            ●───●───●  feature/ui
```

```text
$ git merge feature
업데이트 중 d0bee2f..d16cece
Fast-forward
 test.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

### 3.4 3-way merge

**브랜치가 갈라졌다가 다시 합쳐질 때** 일어나는 병합.  
브랜치를 만든 뒤 양쪽 모두에 새 커밋이 생긴 경우이며, ① 공통 조상 ② `main`의 최신 커밋 ③ `feature`의 최신 커밋 세 가지를 비교해 합치고 **병합 커밋(merge commit)이 새로 생성된다.**

```text
          ②
     ●────●────◆  main   (◆ = 병합 커밋)
    ①\        /
      ●──────●  feature/ui
             ③
```

> **분기가 없으면 Fast-forward, 분기가 있으면 3-way merge**

| | Fast-forward | 3-way merge |
| --- | --- | --- |
| 상황 | 브랜치가 직선으로 이어짐 | 브랜치가 갈라졌다가 합쳐짐 |
| 동작 | 커밋 포인터만 이동 | 세 지점을 비교해 병합 |
| 병합 커밋 | 생성되지 않음 | 생성됨 |
| 충돌 가능성 | 없음 | 있음 |

관련 옵션:

```bash
git merge --ff [브랜치]       # fast-forward가 가능하면 포인터만 이동 (기본값)
git merge --no-ff [브랜치]    # fast-forward가 가능해도 병합 커밋을 생성
git merge --squash [브랜치]   # 브랜치의 변경을 하나로 합쳐 스테이징 (커밋은 직접 생성)
```

### 3.5 Merge conflict

**같은 파일의 같은 부분을 서로 다르게 수정**하면 충돌이 발생한다.  
Git은 자동 병합을 먼저 시도하고, 사람의 판단이 필요한 경우에만 충돌로 알려 준다.

**해결 방법**

1. 충돌 파일 확인 (`git status`)
2. 충돌 코드 직접 수정
3. 새로운 커밋 생성

**실습**

```bash
# 1) 레포지토리 초기화
git init
echo "hello" > test.txt
git add .
git commit -m "first commit"

# 2) feature 브랜치에서 같은 파일 수정
git branch feature
git switch feature
echo "hello from feature" > test.txt
git add .
git commit -m "update from feature"

# 3) main에서도 같은 파일 수정
git switch main
echo "hello from main" > test.txt
git commit -am "update from main"

# 4) 병합 시도 → 충돌 발생
git merge feature
```

```text
자동 병합: test.txt
충돌 (내용): test.txt에 병합 충돌
자동 병합이 실패했습니다. 충돌을 바로잡고 결과물을 커밋하십시오.
```

충돌이 난 파일을 열면(`cat test.txt`) 충돌 지점이 표시되어 있다.

```text
<<<<<<< HEAD
hello from main
=======
hello from feature
>>>>>>> feature
```

- `<<<<<<< HEAD` ~ `=======` : 현재 브랜치(`main`)의 내용
- `=======` ~ `>>>>>>> feature` : 병합하려는 브랜치(`feature`)의 내용

남길 내용으로 파일을 고치고 표시(`<<<<<<<`, `=======`, `>>>>>>>`)를 지운 뒤 커밋한다.

```bash
vi test.txt                               # 충돌 코드 직접 수정
git commit -am "resolve merge conflict"   # 병합 커밋 생성
git log --oneline --graph                 # 결과 확인
```

```text
*   3e2b2bb resolve merge conflict
|\
| * d16cece update from feature
* | 61aed9a update from main
|/
* d0bee2f first commit
```

> 병합을 그만두고 충돌 전 상태로 돌아가려면 `git merge --abort`를 실행한다.

---

## 4. GitHub 실습

### 4.1 원격 저장소 만들고 연결 및 Push 하기

**원격 저장소에 올리는 이유**

- 코드와 Git 사용 내역(커밋 이력)을 공유할 수 있다.
- 오픈 소스 개발에 참여하거나 내 프로젝트를 공개할 수 있다.
- 내 컴퓨터가 고장 나도 코드가 남아 있다. (백업)

**순서**

1. GitHub에서 레포지토리를 생성한다.
   - 오른쪽 위 `+` > `New repository` 클릭
   - Repository name 입력, Public / Private 선택 후 `Create repository` 클릭
   - 로컬에 이미 커밋이 있다면 README, .gitignore는 추가하지 않고 빈 저장소로 만든다. (추가하면 첫 push가 거절된다.)
2. `Quick setup` 에 표시된 주소를 복사한다. (`https://github.com/계정/저장소.git`)
3. 터미널에서 연결하고 push 한다.

```bash
git switch main                                # main 브랜치로 이동
git remote add origin 복사한_Quick_setup_주소   # 원격 저장소 연결
git remote -v                                  # 연결 확인
git push origin main                           # 로컬 커밋 업로드
```

`git remote -v` 를 실행하면 주소가 두 줄 나온다.

| 구분 | 방향 | 의미 |
| --- | --- | --- |
| `fetch` | 원격 저장소 → 내 컴퓨터 | Download |
| `push` | 내 컴퓨터 → 원격 저장소 | Upload |

4. GitHub에 가서 업로드한 내용을 확인한다.

> - 처음 올릴 때 `git push -u origin main` 으로 실행하면 이후에는 `git push` 만 입력해도 된다.
> - GitHub에서 저장소 이름을 바꿨다면 `git remote set-url origin 새_주소` 로 로컬에 저장된 주소를 수정한다.

### 4.2 기본 브랜치를 main으로 설정하는 법

Git을 설치한 환경에 따라 기본 브랜치가 `master` 로 만들어질 수 있다. GitHub의 기본 브랜치는 `main` 이므로 이름을 맞춰 준다.

```bash
git branch -m master main                    # 현재 저장소의 master 브랜치 이름을 main으로 변경
git config --global init.defaultBranch main  # 앞으로 git init 할 때 기본 브랜치를 main으로 생성
```

### 4.3 README 만들고 로컬에 반영하기

`README.md` 는 저장소 첫 화면에 표시되는 소개 문서이다. 파일이 없는 경우 GitHub에서 바로 만들 수 있다.

1. 저장소 화면에서 `Add a README` 클릭
2. 내용 작성 (마크다운 형식) → `Commit changes` 클릭
3. 로컬 저장소에 반영

```bash
git pull origin main    # 로컬에 새 커밋이 없으면 Fast-forward 로 반영된다
```

4. 로컬에서 README 반영 내용 확인

> GitHub 웹에서 파일을 수정하면 GitHub에만 새 커밋이 생긴다. 로컬에서 다음 작업을 하기 전에 `git pull` 부터 한다. 건너뛰고 push 하면 거절(`rejected`)된다.

### 4.4 Issue 생성 및 처리

Issue는 할 일, 버그 리포트, 기능 요청 등을 관리하는 기능이다. Issue → 브랜치 → Pull Request → 코드 리뷰 → Merge 순서로 작업한다.

**1) Issue 생성**

- `Issues` 탭 > `New issue` 클릭
- 예) "README 내용 보완" 이슈 생성 → `#1` 번호가 부여된다.
- 담당자(Assignees), 라벨(Labels) 등을 지정한다.

**2) 브랜치에서 작업 후 push**

VS Code에서 내용을 수정한 뒤 터미널에서 add → commit → push 한다.

```bash
git switch -c docs              # 브랜치 생성 + 만든 브랜치로 바로 이동
git add README.md
git commit -m "README Update"
git push origin docs
```

이 시점에는 변경 내용이 `docs` 브랜치에만 있고 `main` 에는 아직 반영되지 않았다.

**3) Pull Request 생성**

- `Code` 탭(main)에 나타난 `Compare & pull request` 버튼 클릭
- `Open a pull request` 화면에서 제목과 설명을 작성한다. (base: `main` ← compare: `docs`)
- 설명에 `fix: #1` 을 적으면 PR이 병합될 때 #1 이슈가 자동으로 종료된다. (`close`, `fix`, `resolve` 계열 키워드 + 이슈 번호)
- `Create pull request` 클릭

**4) 코드 리뷰**

- `Files changed` 탭에서 변경 내용을 확인한다.
- 코드 줄에 코멘트를 남긴다.
- `Review changes` > `Submit review` 클릭 (리뷰 완료)

**5) Merge**

- `Merge pull request` > `Confirm merge` 클릭 → `docs` 의 내용이 `main` 에 병합된다.
- #1 이슈가 종료(Closed)되었는지 확인한다.

**6) 로컬 main 동기화**

```bash
git switch main
git pull origin main
```

> 병합이 끝난 브랜치는 `git branch -d docs` 로 삭제한다.

### 4.5 다른 레포지토리 가져오기 (Clone)

`git clone` 은 원격 저장소를 커밋 이력까지 그대로 내 컴퓨터로 복사한다.

1. 내려받을 폴더를 만들고 이동한다.

```bash
mkdir clone
cd clone
```

2. 내려받을 레포지토리 페이지에서 주소를 복사한다.
   - 초록색 `<> Code` 버튼 클릭 > `HTTPS` 탭의 주소 복사
3. 복사한 주소로 clone 한다.

```bash
git clone https://github.com/fastapi/fastapi.git
```

4. 내려받은 내용을 확인한다.

```bash
ls                      # 저장소 이름과 같은 fastapi 폴더가 생긴다
cd fastapi
git log --oneline -5    # 커밋 이력까지 함께 받아졌는지 확인
git remote -v           # origin 이 자동으로 연결되어 있다
```

- 원격 저장소가 `origin` 으로 자동 연결되므로 `git init`, `git remote add` 를 할 필요가 없다.
- 기존 Git 저장소 폴더 안에서 clone 하면 저장소가 중첩되므로 별도 폴더에서 실행한다.

---

## 참고 자료

- OZ 코딩스쿨 AI 헬스케어 초격차 캠프 — 「Git & GitHub」
- 노션 : Git 명령어 모음 / 한 입에 먹는 Git & GitHub Repository
