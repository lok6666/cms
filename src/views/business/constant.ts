export const map = {
    RESULTTYPEINFO: {
        title: '结果类型信息',
        useComType: "singleDesc",
        businessConfig: {
            RESULTTYPE: '结果类型（1，企业2，个体）',
        },
    },
    ANNREPORTINFO: {
        title: '企业年报基本信息',
        useComType: "yearInfo",
        businessConfig: {
            SHXYDM: '统一社会信用代码',
            ENTNAME: '企业名称',
            TEL: '企业联系电话',
            ENTSTATUS: '企业经营状态',
            NBYEAR: '年报年份',
            NBDATE: '年报时间',
            REGNO: '注册号',
            EMPNUM: '从业人数',
            POSTCODE: '邮政编码',
            ADDR: '企业通信地址',
            EMAIL: '电子邮箱',   
            ISWEB: '是否有网站或网店',
            ISGQZR: '有限责任公司本年度是否发生股东股权转让',
            ISGMGQ: '企业是否有投资信息或购买其他公司股权',
            
        }
    },

    JUDICIALAIDEQUITYFREEZEINFO: {
        title: '企业司法协助股权冻结信息',
        useComType: "table",
        businessConfig: {
            BZXR: '被执行人',
            ZXFY: '执行法院',
            ZXSX: '执行事项',
            CDSWH: '执行裁定书文号',
            XZZXTZSWH: '执行通知书文号',
            ZZH: '被执行人证照号码',
            DJQXZ: '冻结期限自',
            DJQXZHI: '冻结期限至',
            GSRQ: '公示日期',
            XDJQXZ: '续行冻结期限自',
            XDJQXZHI: '续行冻结期限至',
            XDJQX: '续行冻结期限',
            GQDJZT: '股权冻结状态',
            JDRQ: '解除冻结日期',
            SXRQ: '失效时间',
            SXYY: '失效原因',
        }
    },

    EQUITYPLEDGEDDETAILZXINFO: {
        title: '企业股权出质详情注销',
        useComType: "table",
        businessConfig: {
            ROWKEY: 'RowKey',
            ZXRQ: '企业股权出质详情注销-注销日期',
            ZXYY: '注销原因',
        }
    },

    LISTEDCOMPANYINFORMATIONINFO: {
        title: '上市公司基本信息',
        useComType: "table",
        businessConfig: {
            STOCKCODE: '证券代码',
            STOCKSNAME: '股票简称',
            CNAME: '中文全称',
            CSNAME: '中文简称',
            ENAME: '英文全称',
            ESNAME: '英文简称',
            BUILDDATE: '成立日期',
            REGICAP: '注册资本',
            // CURNCY: '币种',
            REGIADDR: '注册地址',
            OFFICEADDR: '办公地址',
            WEBSITE: '公司网址',
            COMBRIEF: '公司简介',
            PRIBIZ: '主营业务',
            STAFFNUM: '员工人数',
            DECLAREDATE: '信息发布日期',
            LISTDATE: '上市日期',
            STATUSTYPEREF: '上市状态',
            TRADEMKTREF: '市场代码',
            STKTYPEREF: '证券类别',
            LISTENDDATE: '退市日期',
            ISIN: 'ISIN代码',
        }
    },


    BRANCHINFO: {
        title: '企业分支机构',
        useComType: "table",
        businessConfig: {
            ENTNAME: '分支机构名称',
            // SHXYDM: '统一社会信用代码',
            FRDB: '负责人',
            ESDATE: '成立日期',
            ENTSTATUS: '经营状态',
            PROVINCE: '登记地省份',
            REGNO: '注册号',
        }
    },


    ANNREPORTINVINFO: {
        title: '企业年报股东及出资信息',
        useComType: "table",
        businessConfig: {
            NBYEAR: '年报年份',
            NBDATE: '年报时间',
            SHANAME: '股东名称',
            CONAM: '认缴出资额',
            CONDATE: '认缴出资时间',
            CONFORM: '认缴出资方式',
            ACCONAM: '实缴出资额',
            ACCDATE: '实缴出资时间',
            ACCFORM: '实缴出资方式',
            // CONCUR: '认缴出资币种',
            // ACCCUR: '实缴币种',
        }
    },


    ANNREPORTFORGUARANTEEINFO: {
        title: '企业年报对外担保信息',
        useComType: "table",
        businessConfig: {
            NBYEAR: '年报年份',
            NBDATE: '年报时间',
            ZQR: '债权人',
            ZWR: '债务人',
            ZQZL: '主债权种类',
            ZQSE: '主债权数额',
            ZQQXFROM: '履行债务的期限自',
            ZQQXTO: '履行债务的期限至',
            BZQJ: '保证的期间',
            BZFS: '保证的方式',
        }
    },


    LISTEDCOMPANYSHAREHOLDEINFO: {
        title: '上市公司十大股东',
        useComType: "table",
        businessConfig: {
            ENDDATE: '截止日期',
            DECLAREDATE: '信息发布日期',
            RANK: '股东排名',
            NAME: '股东名称',
            ORGCODE: '股东代码',
            SHRHLDTYPE: '股东股权性质',
            HOLDNUM: '持股数量',
            HOLDPCT: '持股数量占总股本比例',
            ADDNUM: '本期变动数量',
            FROZENPLEDGENUM: '质押或冻结的股份数量',
        }
    },



    CHATTELMORTGAGEDYQRINFO: {
        title: '企业动产抵押详情抵押权人',
        useComType: "table",
        businessConfig: {
            ROWKEY: '企业动产抵押详情抵押权人-RowKey',
            DYQRMC: '抵押权人名称',
            DYQRZJ: '抵押权人证照/证件类型',
            ZJH: '证照/证件号码',
        }
    },


    ASSOCIATEPERSONINVESTMENTINFO: {
        title: '企业关联人员投资',
        useComType: "table",
        businessConfig: {
            NAME: '姓名',
            TYPE: '分组',
            ENTNAME: '被投企业名称',
            REGCAP: '注册资本',
            ESDATE: '成立日期',
            ENTSTATUS: '经营状态',
            SUBCONAM: '认缴出资额',
            // CONCUR: '出资币种',
            CONRATIO: '出资比例',
            CONDATE: '出资时间',
            // SHXYDM: '统一社会信用代码',
        }
    },


    SERIOUSDISHONESTYINFO: {
        title: '企业严重违法失信企业（黑名单）信息',
        useComType: "table",
        businessConfig: {
            TYPE: '类别',
            LRYZWFYY: '列入黑名单原因',
            LRRQ: '列入日期',
            ZCJDJG: '作出决定机关（列入）',
            YCYAWFYY: '黑名单原因',
            YCRQ: '移出日期',
            YCYZWFJG: '作出决定机关（移出）',
        }
    },


    ANNREPORTASSETSINFO: {
        title: '企业年报资产状况',
        useComType: "table",
        businessConfig: {
            NBYEAR: '年报年份',
            NBDATE: '年报时间',
            ASSGRO: '资产总额',
            LIAGRO: '负债总额',
            VENDINC: '营业总收入',
            MAIBUSINC: '其中主营业务收入',
            PROGRO: '利润总额',
            NETINC: '净利润',
            RATGRO: '纳税总额',
            TOTEQU: '所有者权益合计',
        }
    },


    EQUITYPLEDGEDDETAILBGINFO: {
        title: '企业股权出质详情变更',
        useComType: "table",
        businessConfig: {
            ROWKEY: '企业股权出质详情变更-RowKey',
            BGRQ: '变更日期',
            BGNR: '变更内容',
        }
    },


    ANNREPORTSTOCKCHANAGEINFO: {
        title: '企业年报股权变更信息',
        useComType: "table",
        businessConfig: {
            NBYEAR: '年报年份',
            NBDATE: '年报时间',
            INV: '股东名称',
            TRANSAMPR: '变更前股权比例',
            TRANSAMAFT: '变更后股权比例',
            ALTDATE: '股权变更日期',
        }
    },


    INVESTMENTABROADINFO: {
        title: '企业对外投资',
        useComType: "table",
        businessConfig: {
            ENTNAME: '被投企业名称',
            // SHXYDM: '统一社会信用代码',
            ESDATE: '成立日期',
            ENTSTATUS: '经营状态',
            REGCAP: '注册资本',
            SUBCONAM: '认缴出资额',
            // CONCUR: '出资币种',
            CONRATIO: '出资比例',
            // CONDATE: '出资时间',
        }
    },

    SPOTCHECKINFO: {
        title: '企业抽查检查信息',
        useComType: "table",
        businessConfig: {
            INSPORG: '检查实施机关',
            INSPTYPE: '类型',
            INSPDATE: '日期',
            INSPRESULT: '结果',
        }
    },


    ANNREPORTWEBSITEINFO: {
        title: '企业年报网站网店信息',
        useComType: "table",
        businessConfig: {
            NBYEAR: '年报年份',
            NBDATE: '年报时间',
            WEBNAME: '网站（网店）名称',
            WEBURL: '网站（网店）网址',
            WEBTYPE: '网站网店类型',
        }
    },


    CHATTELMORTGAGEBDBZQINFO: {
        title: '企业动产抵押详情被担保债权',
        useComType: "table",
        businessConfig: {
            ROWKEY: '企业动产抵押详情被担保债权-RowKey',
            ZL: '种类',
            DBFW: '担保的范围',
            SE: '数额',
            LXZWKSRQ: '债务人履行债务开始日期',
            LXZWJSRQ: '债务人履行债务结束日期',
            BZ: '被担保债权-备注',
        }
    },


    MAINMANAGERINFO: {
        title: '企业主要管理人员信息',
        useComType: "table",
        businessConfig: {
            NAME: '姓名',
            POSITION: '职务',
            ISFRDB: '是否法定代表人',
        }

    },

    BASICINFO: {
        title: '基本信息',
        useComType: "bescInfo",
        businessConfig: {
            ENTNAME: '企业名称',
            FRDB: '法定代表人',
            SHXYDM: '统一社会信用代码',
            INDUSTRY_CODE: '行业门类',
            REGCAP: '注册资本',
            ENTSTATUS: '经营状态',
            ESDATE: '成立日期',
            APPRDATE: '核准日期',
            INDUSTRY: '行业门类',
            INDUSTRYCODE: '行业门类代码',
            ENTTYPE: '企业类型',
            DOM: '地址',
            REGORG: '登记机关',
            OLDNAME: '曾用名',              
            PROVINCE: '登记地省份',
            CITYCODE: '登记地城市代码',
            JWD: '地理坐标',      
            ORGID: '组织机构代码',
            ENGNAME: '企业英文名',
            WEBSITE: '企业官网',
            OPFROM: '经营期限自',
            OPTO: '经营期限至',
            OPSCOPE: '经营业务范围'            
        }
    },

    SHAREHOLDERINFO: {
        title: '企业股东及出资信息',
        useComType: "table",
        businessConfig: {
            INV: '股东名称',
            // SHXYDM: '统一社会信用代码',
            INVTYPE: '股东类型',
            SUBCONAM: '认缴出资额',
            // CONCUR: '出资币种',
            CONRATIO: '出资比例',
            CONDATE: '出资时间',
        }

    },

    LAWADMININFO: {
        title: '企业行政处罚',
        useComType: "table",
        businessConfig: {
            PENDECNO: '行政处罚决定书文号',
            ILLEGACTTYPE: '违法行为类型',
            PENRESULT: '行政处罚内容',
            CASEDEP: '决定机关名称',
            PENDECISSDATE: '处罚决定日期',
            PUBDATE: '公示时间',
        }
    },


    CHATTELMORTGAGEINFO: {
        title: '企业动产抵押信息',
        useComType: "table",
        businessConfig: {
            DJBH: '登记编号',
            DJRQ: '登记日期',
            DJJG: '登记机关',
            BDBZQSE: '被担保债权数额',
            ZT: '状态',
            GSRQ: '公示日期',
            ROWKEY: 'RowKey',
        }
    },

    CHATTELMORTGAGEZXINFO: {
        title: '企业动产抵押详情注销',
        useComType: "table",
        businessConfig: {
            ROWKEY: 'RowKey',
            ZXRQ: '注销日期',
            ZXYY: '注销原因',
        }
    },


    CHATTELMORTGAGEBGINFO: {
        title: '企业动产抵押详情变更',
        useComType: "table",
        businessConfig: {
            ROWKEY: 'RowKey',
            BGRQ: '变更日期',
            BGNR: '变更内容',
        }
    },


    LAWPERSONTOOTHERINFO: {
        title: '法定代表人对外任职',
        useComType: "table",
        businessConfig: {
            NAME: '姓名',
            ENTNAME: '任职企业名称',
            // SHXYDM: '统一社会信用代码',
            ESDATE: '成立日期',
            REGCAP: '注册资本',
            ENTSTATUS: '经营状态',
            POSITION: '职务',
            ISFRDB: '是否法定代表人',
            REGNO: '注册号',
        }
    },


    ASSOCIATEPERSONOFFICEINFO: {
        title: '企业关联人员任职',
        useComType: "table",
        businessConfig: {
            NAME: '姓名',
            TYPE: '分组',
            ENTNAME: '任职企业名称',
            ESDATE: '成立日期',
            ENTSTATUS: '经营状态',
            POSITION: '职务',
            LEREPSIGN: '是否法定代表人',
            // SHXYDM: '统一社会信用代码',
            REGCAP: '注册资本',
        },
    },
    CHATTELMORTGAGEDYWINFO: {
        title: '企业动产抵押详情抵押物',
        useComType: "table",
        businessConfig: {
            ROWKEY: '企业动产抵押详情抵押物-RowKey',
            DYWMC: '名称',
            SYQGS: '所有权归属',
            JBQK: '数量/质量/状况/所在地等情况',
            BZ: '抵押物-备注',
        }
    },

    SIMPLECANCELINFO: {
        title: '企业简易注销公告信息',
        useComType: "table",
        businessConfig: {
            ENTNAME: '企业名称',
            UNISCID: '统一社会信用代码',
            REGNO: '注册号',
            REGORG: '登记机关',
            GGSQRQ: '公告申请日期',
            GGRQZI: '公告期自',
            GGRQZHI: '公告期至',
            JYZXJG: '简易注销结果',
        }
    },

    ANNREPORTSOCIALSECURITYINFO: {
        title: '企业年报社保信息',
        useComType: "singleDesc",
        businessConfig: {
            NBYEAR: '年报年份',
            NBDATE: '年报时间',
            A1: '城镇职工基本养老保险',
            A2: '失业保险',
            A3: '职工基本医疗保险',
            A4: '工伤保险',
            A5: '生育保险',
            B1: '单位参加城镇职工基本养老保险缴费基数',
            B2: '单位参加失业保险缴费基数',
            B3: '单位参加职工基本医疗保险缴费基数',
            B5: '单位参加生育保险缴费基数',
            C1: '参加城镇职工基本养老保险本期实际缴费基数',
            C2: '参加失业保险本期实际缴费基数',
            C3: '参加职工基本医疗保险本期实际缴费基数',
            C4: '参加工伤保险本期实际缴费基数',
            C5: '参加生育保险本期实际缴费基数',
            D1: '单位参加城镇职工基本养老保险累计欠缴金额',
            D2: '单位参加失业保险累计欠缴金额',
            D3: '单位参加职工基本医疗保险累计欠缴金额',
            D4: '单位参加工伤保险累计欠缴金额',
            D5: '单位参加生育保险累计欠缴金额',
        }
    },

    ANNREPORTTOINVINFO: {
        title: '企业年报对外投资',
        useComType: "table",
        businessConfig: {
            NBYEAR: '年报年份',
            NBDATE: '年报时间',
            ENTNAME: '投资设立企业或购买股权企业名称',
            REGNO: '注册号/统一社会信用代码',
        }
    },

    LAWPERSONTOINVESTINFO: {
        title: '法定代表人对外投资',
        useComType: "table",
        businessConfig: {
            NAME: '姓名',
            ENTNAME: '被投企业名称',
            // SHXYDM: '统一社会信用代码',
            ESDATE: '成立日期',
            REGCAP: '注册资本',
            ENTSTATUS: '经营状态',
            SUBCONAM: '认缴出资额',
            // CONCUR: '出资币种',
            CONRATIO: '出资比例',
            CONDATE: '出资时间',
            REGNO: '注册号',
        }
    },

    ABNORMALOPERATIONINFO: {
        title: '企业经营异常信息',
        useComType: "table",
        businessConfig: {
            REASONIN: '列入经营异常名录原因',
            DATEIN: '列入日期',
            REGORGIN: '作出决定机关（列入）',
            REASONOUT: '移出经营异常名录原因',
            DATEOUT: '移出日期',
            REGORGOUT: '作出决定机关（移出）',
            ISMOVE: '是否移除',
        }
    },

    JUDICIALAIDINFO: {
        title: '企业司法协助信息',
        useComType: "table",
        businessConfig: {
            BZXR: '被执行人',
            GQSE: '股权数额',
            ZXFY: '执行法院',
            ZXTZSWH: '执行通知书文号',
            TYPE: '类型',
            STATE: '状态',
            ID: '详情ID',
            // BZ: '币种',
            GQSEDW: '股权数额单位',
        }
    },

    SETTLEACCOUNTINFO: {
        title: '企业清算信息',
        useComType: "table",
        businessConfig: {
            LIQHEAD: '清算组负责人',
            LIQMEMBER: '清算组成员',
        }
    },

    JUDICIALAIDEQUITYCHANGEINFO: {
        title: '企业司法协助股权变更信息',
        useComType: "table",
        businessConfig: {
            ZXFY: '执行法院',
            ZXSX: '执行事项',
            ZXCDSWH: '执行裁定书文号',
            ZXTZSWH: '执行通知书文号',
            BZXR: '被执行人',
            GQSE: '被执行人持有股权数额',
            BZXRZZLX: '被执行人证照种类',
            BZXRZZH: '被执行人证照号码',
            SRY: '受让人',
            XZZXRQ: '协助执行日期',
            SRYZZLX: '受让人证照种类',
            SRYZZH: '受让人证照号码',
            // BZ: '币种',
        }
    },

    EQUITYPLEDGEDINFO: {
        title: '企业股权出质信息',
        useComType: "table",
        businessConfig: {
            GSRQ: '公示日期',
            DJBH: '登记编号',
            CZR: '出质人',
            CZRZJHM: '出质人证照/证件号码',
            CZGQSE: '出质股权数额',
            ZQR: '质权人',
            ZQRZJHM: '质权人证照/证件号码',
            GQCZSLDJRQ: '股权出质设立登记日期',
            ZT: '状态',
            ROWKEY: '企业股权出质列表-RowKey',
        }
    },

    CHANGEINFO: {
        title: '变更信息',
        useComType: "table",
        businessConfig: {
            ALTITEM: '变更事项',
            ALTBE: '变更前内容',
            ALTAF: '变更后内容',
            ALTDATE: '变更时间',
        }
    },

    ANNREPORTUPDATEINFO: {
        title: '企业年报修改信息',
        useComType: "table",
        businessConfig: {
            NBYEAR: '年报年份',
            NBDATE: '年报时间',
            ALITEM: '修改事项',
            ALTBE: '修改前',
            ALTAF: '修改后',
            ALTDATE: '修改日期',
        }
    }

};


/* 
STATISTICSINFO: title: '统计结果集', {
    BASICINFO: '企业基本信息统计数',
    LISTEDCOMPANYINFORMATIONINFO: '上市公司基本信息统计数',
    LISTEDCOMPANYSHAREHOLDEINFO: '上市公司十大股东统计数',
    SHAREHOLDERINFO: '企业股东及出资信息统计数',
    MAINMANAGERINFO: '企业主要管理人员信息统计数',
    INVESTMENTABROADINFO: '企业对外投资统计数',
    LAWPERSONTOINVESTINFO: '法定代表人对外投资统计数',
    LAWPERSONTOOTHERINFO: '法定代表人对外任职统计数',
    CHANGEINFO: '企业变更信息统计数',
    BRANCHINFO: '企业分支机构统计数',
    LAWADMININFO: '企业行政处罚统计数',
    JUDICIALAIDEQUITYFREEZEINFO: '企业司法协助股权冻结信息统计数',
    EQUITYPLEDGEDINFO: '企业股权出质信息统计数',
    CHATTELMORTGAGEINFO: '企业动产抵押信息统计数',
    SETTLEACCOUNTINFO: '企业清算信息统计数',
    ABNORMALOPERATIONINFO: '企业经营异常信息统计数',
    SERIOUSDISHONESTYINFO: '企业严重违法失信企业（黑名单）信息统计数',
    SPOTCHECKINFO: '企业抽查检查信息统计数',
    JUDICIALAIDINFO: '企业司法协助信息统计数',
    JUDICIALAIDEQUITYCHANGEINFO: '企业司法协助股权变更信息统计数',
    SIMPLECANCELINFO: '企业简易注销公告信息统计数',
    ASSOCIATEPERSONOFFICEINFO: '企业关联人员任职统计数',
    ASSOCIATEPERSONINVESTMENTINFO: '企业关联人员投资统计数',
    ANNREPORTINFO: '企业年报基本信息统计数',
    ANNREPORTINVINFO: '企业年报股东及出资信息统计数',
    ANNREPORTTOINVINFO: '企业年报对外投资统计数',
    ANNREPORTWEBSITEINFO: '企业年报网站网店信息统计数',
    ANNREPORTASSETSINFO: '企业年报资产状况统计数',
    ANNREPORTFORGUARANTEEINFO: '企业年报对外担保信息统计数',
    ANNREPORTSTOCKCHANAGEINFO: '企业年报股权变更信息统计数',
    ANNREPORTSOCIALSECURITYINFO: '企业年报社保信息统计数',
    ANNREPORTUPDATEINFO: '企业年报修改信息统计数',
    EQUITYPLEDGEDINFO: '企业股权出质列表统计数',
    EQUITYPLEDGEDDETAILBGINFO: '企业股权出质详情变更统计数',
    EQUITYPLEDGEDDETAILZXINFO: '企业股权出质详情注销统计数',
    CHATTELMORTGAGEINFO: '企业动产抵押列表统计数',
    CHATTELMORTGAGEDYQRINFO: '企业动产抵押详情抵押权人统计数',
    CHATTELMORTGAGEBDBZQINFO: '企业动产抵押详情被担保债权统计数',
    CHATTELMORTGAGEDYWINFO: '企业动产抵押详情抵押物统计数',
    CHATTELMORTGAGEBGINFO: '企业动产抵押详情变更统计数',
    CHATTELMORTGAGEZXINFO: '企业动产抵押详情注销统计数',
} */
