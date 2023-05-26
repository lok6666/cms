const levelMap = {
    区级: 1,
    市级: 2,
    国家级: 3
  };
  const typeMap = {
    失效: 0,
    有效: 1
  };
  
  const locationMap = {
    china: '中国',
    shijingshan: "石景山",
    beijing: "北京",
  };
  const levelOptions = [
    {
      value: "区级",
      label: "区级",
    },
    {
      value: "市级",
      label: "市级",
    },
    {
      value: "国家级",
      label: "国家级",
    },
  ];
  const kindOptions = [
    {
      value: "政策文件",
      label: "政策文件",
    },
    {
      value: "通知公告",
      label: "通知公告",
    },
    {
      value: "政策解读",
      label: "政策解读",
    },
  ];
  const policyOptions = [
    {
      value: "政策文件",
      label: "政策文件",
    },
    {
      value: "通知公告",
      label: "通知公告",
    },
    {
      value: "政策解读",
      label: "政策解读",
    },
  ];
  const typeOptions = [
    {
      value: "有效",
      label: "有效",
    },
    {
      value: "失效",
      label: "失效",
    },
  ];
  const locationOptions = [
    {
      value: "",
      label: "全部",
    },
    {
      value: "beijing",
      label: "北京",
    },
    {
      value: "dongcheng",
      label: "东城区",
    },
    {
      value: "xicheng",
      label: "西城区",
    },
    {
      value: "haidian",
      label: "海淀区",
    },
    {
      value: "chaoyang",
      label: "朝阳区",
    },
    {
      value: "changping",
      label: "昌平区",
    },
    {
      value: "shijingshan",
      label: "石景山区",
    },
    {
      value: "tongzhou",
      label: "通州区",
    },
    {
      value: "shunyi",
      label: "顺义区",
    },
    {
      value: "yanqing",
      label: "延庆区",
    },
    {
      value: "pinggu",
      label: "延庆区",
    },
    {
      value: "mentougou",
      label: "门头沟区",
    }
  ];
  const locationOptions1 = [
    {
      value: "gongzhonghao",
      label: "公众号",
    },
    {
      value: "",
      label: "全部",
    },
    {
      value: "beijing",
      label: "北京",
    },
    {
      value: "dongcheng",
      label: "东城区",
    },
    {
      value: "xicheng",
      label: "西城区",
    },
    {
      value: "haidian",
      label: "海淀区",
    },
    {
      value: "chaoyang",
      label: "朝阳区",
    },
    {
      value: "changping",
      label: "昌平区",
    },
    {
      value: "shijingshan",
      label: "石景山区",
    },
    {
      value: "tongzhou",
      label: "通州区",
    },
    {
      value: "shunyi",
      label: "顺义区",
    },
    {
      value: "yanqing",
      label: "延庆区",
    },
    {
      value: "pinggu",
      label: "延庆区",
    },
    {
      value: "mentougou",
      label: "门头沟区",
    }
  ];
  const tagMap = {
    "惠企方式:": `惠企方式: 全惠企方式`,
    "文化行业类别:" : `文化行业类别: 全文化行业`,
    "科技行业类别:": `科技行业类别: 全科技行业`,
    "企业分类:":`企业分类::全企业分类`,
    "科技企业分类:": `科技企业分类: 全科技分类`,
    "企业规模:": `企业规模: 全规模`,
    "成立年限:": `成立年限: 全年限`,
    "企业资质:": `企业资质: 全资质`
  };
  const relationOptions = [
    {
      value: 0,
      label: "无关联",
    },
    {
      value: 1,
      label: "关联",
    },
  ];
  const personOptions = [
    {
      value: '张全勇',
      label: "张全勇"
    },
    {
      value: '蔡凤',
      label: "蔡凤"
    },
    {
      value: '许宁',
      label: "许宁"
    },
    {
      value: '任翰墨',
      label: "任翰墨"
    },
    {
      value: '崔雨萱',
      label: "崔雨萱"
    }
  ];
    module.exports = {
      levelMap,
      typeMap,
      tagMap,
      locationMap,
      levelOptions,
      kindOptions,
      policyOptions,
      typeOptions,
      locationOptions,
      locationOptions1,
      relationOptions,
      personOptions
    }