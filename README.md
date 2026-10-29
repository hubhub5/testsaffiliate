# 작은 순간 유형 사전

일상의 작은 순간으로 생각과 행동의 경향을 보는 테스트 모음. Astro 정적 사이트.

```
npm run dev      # 개발 서버
npm run build    # 데이터 검사 + 톤 린트 + 빌드 + 검색 색인(pagefind)
npm run preview  # 빌드 결과 보기
```

## 쿠팡 파트너스 링크
`src/data/products.json`의 `link` 칸만 채우면 된다. 비어 있으면 쿠팡 검색 결과(`query`)로 연결되고, 개발 서버에서는 상품 옆에 `링크 미설정`이 표시된다.

## 테스트 추가
`src/data/tests/T-0013.json`처럼 파일 하나를 추가한다. 형식은 기존 파일을 따른다. `npm run check`가 글자 수, 유형 수, 상품·참고문헌 참조, 금지 표현을 검사한다.

- 유형 4–5개, 문항 8–10개, 선택지 3–5개
- 유형마다 `picks`는 책 1, 물건 1 순서
- 책은 국내 출간을 확인한 것만 넣는다
- 참고문헌은 `src/data/sources.json`에 먼저 등록한다

배포: main에 푸시하면 GitHub Actions가 빌드해 Pages(https://hubhub5.github.io/testsaffiliate/)에 올린다.
