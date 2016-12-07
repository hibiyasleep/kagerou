'use strict'

;(function() {

  const L = {
    ko: {
      style: {
        'body-margin': '바깥쪽 여백',
        'body-font': '글꼴',
        'nav-bg-translucent': '상단 바 배경',
        'ui-bg': 'UI 배경',
        'ui-fg': 'UI 전경',
        'color-accent': '강조색',
        'shadow-card': '상자 그림자',
        'shadow-text': '텍스트 그림자',
        'font-size-small': '작은 글씨 크기',
        'graph-height': '열 높이'
      },
      col: { // [short, long]
        i: {
          _: '정보',
          icon: ['<img src="img/class/empty.png" class="clsicon"/>', '직업 아이콘'],
          owner: ['주인', '주인'],
          name: ['이름', '이름']
        },
        deal: {
          _: '딜',
          per_second: ['DPS', 'DPS'],
          pct: ['딜%', '기여율'],
          total: ['딜 합계', '합계'],
          accuracy: ['실패율', '실패율 (빗나감 / 타격)'],
          swing: ['타격', '타격 횟수'],
          miss: ['빗나감', '빗나간 횟수'],
          hitfail: ['막힘', '막힌 횟수'],
          critical: ['극대', '극대화 비율'],
          max: ['Max-', '최대량 (스킬명 제외)'],
          maxhit: ['Max-', '최대량 (스킬명 포함)']
        },
        tank: {
          _: '탱',
          damage: ['받은 뎀', '받은 데미지'],
          heal: ['받은 힐', '받은 힐'],
          parry: ['받넘', '받아넘기기'],
          block: ['회피', '회피']
        },
        heal: {
          _: '힐',
          per_second: ['HPS', 'HPS'],
          pct: ['힐%', '기여율'],
          total: ['힐 합계', '합계'],
          over: ['Ovr+', '오버힐'],
          swing: ['타격', '타격 횟수'],
          critical: ['+극대', '극대화 비율'],
          cure: ['치료', '치료 (디버프 해제)'],
          max: ['Max+', '최대량 (스킬명 제외)'],
          maxhit: ['Max+', '최대량 (스킬명 포함)']
        },
        etc: {
          _: '기타',
          powerdrain: ['P.drn', 'Power drain'],
          powerheal: ['변환', '자원 변환'],
          death: ['사망', '데스카운트']
        }
      }
    }
  }


  class Locale {

    constructor() {
      this.current = window.config.get('lang') || CONFIG_DEFAULT.locale
    }

    get(path) {
      return resolveDotIndex(L[this.current], path)
    }

    available(v) {
      return v in L
    }

    skillname(n) {
      let o = n.split('-')
      let name = this.get('skill.' + o[0])
      let value = o[1] || -1

      if(!value) {
        return name + '-' + value
      } else {
        return name
      }
    }

    get locale() {
      return Object.keys(L)
    }

    set locale(v) {
      if(this.available(v)) {
        this.current = v
      } else {
        return false
      }
    }

  }

  window.L = L
  window.Locale = Locale

})()
