'use strict'

;(function() {

  const L = {
    ko: {
      skill: {},
      config: {
        style: {
          _: '스타일',
          'resize-factor': 'UI 크기 조절',
          'body-margin': '헤더와 테이블 사이의 너비',
          'body-font': '본문 폰트',
          'nav-opacity': '비활성 시 상단 바 투명도',
          'nav-bg': '상단 바 배경',
          'nav-fg': '상단 바 글자 색',
          'header-bg': '테이블 헤더 배경',
          'dropdown-bg': '드롭다운 배경',
          'dropdown-fg': '드롭다운 글자 색',
          'content-bg': '테이블 배경',
          'content-fg': '테이블 글자 색',
          'color-accent': '강조색',
          'shadow-card': '오버레이 창 그림자',
          'shadow-text': '텍스트 그림자',
          'font-size-small': '작은 글자 크기',
          'gauge-height': '게이지 높이',
          'graph-height': '테이블 한 줄 높이'
        },
        color: {
          _: '게이지 색상',
          'gauge-default': '게이지 기본 색상',
          'gauge-opacity': '게이지 투명도',
          'position-tank': '방어 역할 표시',
          'position-deal': '공격 역할 표시',
          'position-heal': '회복 역할 표시',
          pld: '나이트 (검술사)',
          war: '전사 (도끼술사)',
          drk: '암흑기사',
          mnk: '몽크 (격투사)',
          drg: '용기사 (창술사)',
          brd: '음유시인 (궁술사)',
          nin: '닌자 (쌍검사)',
          smn: '소환사 (비술사)',
          blm: '흑마도사 (주술사)',
          mch: '기공사',
          whm: '백마도사 (환술사)',
          sch: '학자',
          ast: '기공사',
          'smn-pet': '소환사 (비술사) 소환수',
          'sch-pet': '학자 소환수',
          'mch-pet': '기공사 포탑',
          'chocobo': '초코보',
          'limit-break': '리밋 브레이크'
        }
      },
      col: { // [short, long]
        i: {
          _: '정보',
          icon: [
            '<img src="../share/img/class/empty.png" class="clsicon"/>',
            '직업 아이콘'
          ],
          class: ['직업', '클래스/잡'],
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
          max: ['Max-', 'Max (스킬명 제외)'],
          maxhit: ['Max Damage', 'Max']
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
          max: ['Max+', 'Max (스킬명 제외)'],
          maxhit: ['Max Heal', 'Max']
        },
        etc: {
          _: '기타',
          powerdrain: ['P.drn', 'Powerdrain'],
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
      if(!n) return ''
      let o = n.split('-')
      let name = this.get('skill.' + o[0]) || o[0]
      let value = o[1] || -1

      if(value) {
        return name + ': ' + value
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
