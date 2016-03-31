/**
 * Created by anily on 1/15/14.
 */
//

var app = angular.module('app');

app.config(['$stateProvider','$urlRouterProvider','AccessLevels',
  function($stateProvider, $urlRouterProvider,AccessLevels) {
    // default to publisher analytics,
    // see https://github.com/angular-ui/ui-router/issues/600 for why we don't use
    // simplier `otherwise` call.
    $urlRouterProvider.otherwise(function($injector, $location) {
        var $state = $injector.get("$state");
        $state.go("entities_list_wt_entity", { entity: 'publisher'});
    });
    $urlRouterProvider.when('/g/analytics','/g/analytics/publisher');

    //
    // $urlRouterProvider.when('/analytics/publishers/:id','/analytics/publishers/:id/traffic/monthly');
    // $urlRouterProvider.when('/analytics/publishers/:id/traffic','/analytics/publishers/:id/traffic/monthly');
    //

    //
    // Now set up the states
    //
    //*************************************************************************
    // STATE NAMES MUST CORRESPONDS TO THE CONSTS DEFINED BY THE
    // Inventory data service.
    // See listInventoryCtrl.updateLocation
    //*************************************************************************
    $stateProvider

// Von publishers revamp START
    
    .state('PublishersUIRoot', {
        url: "/publishers",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          body: {
            templateUrl: "src/app/publishers/Publishers.tpl.html",
            controller: "PublishersCtrl"
          }
        },
        abstract: true,
        breadcrumb: {
          displayName: 'Publishers'
        }
      })
      .state('PublishersUIRoot.index', {
        url: "",
        params: {msg: null},
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          content: {
            templateUrl: "src/app/publishers/PublishersList.tpl.html",
            controller: "PublishersListCtrl"
          }
        },
      })
      .state('PublishersUIRoot.create', {
        url: "/new",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          content: {
            templateUrl: "src/app/publishers/new/PublishersCreate.tpl.html",
            controller: "PublisherCreateCtrl"
          }
        },
        breadcrumb: {
          displayName: 'New'
        }
      })
      .state('PublishersUIRoot.single', {
        url: "/:id",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          content: {
            templateUrl: "src/app/publishers/Publisher.tpl.html",
            controller: "PublisherCtrl"
          }
        },
        abstract: true,
        breadcrumb: {
          displayName: '{{ publisher.name }}'
        },
        resolve: {
          publisher: function(Publisher, $stateParams) {
            return Publisher.getPublisher($stateParams.id);
          }
        }
      })
      .state('PublishersUIRoot.single.info', {
        url: "/info",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          subContent: {
            templateUrl: "src/app/publishers/info/PublisherInfo.tpl.html",
            controller: "PublisherInfoCtrl"
          }
        }
      })
      .state('PublishersUIRoot.single.zones', {
        url: "",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          subContent: {
            templateUrl: "src/app/publishers/creativezones/Zones.tpl.html",
            controller: "ZonesCtrl"
          }
        }
      })

// Von publishers revamp END

      .state('Publisher',{
        url: "/inventory/publishers",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": {
            templateUrl: "src/app/inventory/templates/publishers.tpl.html",
            controller : "ListInventoryCtrl"
          }
        },
        data: {
            access: AccessLevels.user
        }
      })
      .state('Publisher.id',{
        url: "/:id"
      })
      .state('CreativeZone',{
        url: "/inventory/creativezones",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": {
            templateUrl: "src/app/inventory/templates/creativezones.tpl.html",
            controller : "ListInventoryCtrl"
          }
        },
        data: {
            access: AccessLevels.user
        }
      })

// Von Creative Zones revamp START

      .state('CreativeZonesUIRoot', {
        url: "/creativezones",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          body: {
            templateUrl: "src/app/creativezones/CreativeZones.tpl.html",
            controller: "CreativeZonesCtrl"
          }
        },
        abstract: true,
        breadcrumb: {
          displayName: 'Creative Zones'
        }
      })
      .state('CreativeZonesUIRoot.index', {
        url: "",
        params: {msg: null},
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          content: {
            templateUrl: "src/app/creativezones/CreativeZonesList.tpl.html",
            controller: "CreativeZonesListCtrl"
          }
        },
      })
      .state('CreativeZonesUIRoot.create', {
        url: "/new",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          content: {
            templateUrl: "src/app/creativezones/new/CreativeZonesCreate.tpl.html",
            controller: "CreativeZoneCreateCtrl"
          }
        },
        breadcrumb: {
          displayName: 'New'
        }
      })
      .state('CreativeZonesUIRoot.single', {
        url: "/:id",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          content: {
            templateUrl: "src/app/creativezones/CreativeZone.tpl.html",
            controller: "CreativeZoneCtrl"
          }
        },
        abstract: true,
        breadcrumb: {
          displayName: '{{ creativeZone.name }}'
        },
        resolve: {
          creativeZone: function(CreativeZone, $stateParams) {
            return CreativeZone.getCreativeZone($stateParams.id);
          }
        }
      })
      .state('CreativeZonesUIRoot.single.info', {
        url: "/info",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          subContent: {
            templateUrl: "src/app/creativezones/info/CreativeZoneInfo.tpl.html",
            controller: "CreativeZoneInfoCtrl"
          }
        }
      })
      .state('CreativeZonesUIRoot.single.rotations', {
        url: "",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          subContent: {
            templateUrl: "src/app/creativezones/rotation/CreativeZoneRotation.tpl.html",
            controller: "CreativeZoneRotationCtrl"
          }
        }
      })

// Von Creative Zone revamp END

      .state('CreativeZone.id',{
        url: "/:id"
      })
      .state('Advertiser',{
        url: "/inventory/advertisers",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": {
            templateUrl: "src/app/inventory/templates/advertisers.tpl.html",
            controller : "ListInventoryCtrl"
          }
        },
        data: {
            access: AccessLevels.user
        }
      })
      .state('Advertiser.id',{
        url: "/:id"
      })
// Von Sell Campaign revamp START
      .state('SellCampaignsUIRoot', {
        url: "/sellcampaigns",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          body: {
            templateUrl: "src/app/sellcampaigns/SellCampaigns.tpl.html",
            controller: "SellCampaignsCtrl"
          }
        },
        abstract: true,
        breadcrumb: {
          displayName: 'Sell Campaigns'
        }
      })
      .state('SellCampaignsUIRoot.index', {
        url: "",
        params: {msg: null},
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          content: {
            templateUrl: "src/app/sellcampaigns/SellCampaignsList.tpl.html",
            controller: "SellCampaignsListCtrl"
          }
        },
      })
      .state('SellCampaignsUIRoot.create', {
        url: "/new",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          content: {
            templateUrl: "src/app/sellcampaigns/new/SellCampaignsCreate.tpl.html",
            controller: "SellCampaignsCreateCtrl"
          }
        },
        breadcrumb: {
          displayName: 'New'
        }
      })
      .state('SellCampaignsUIRoot.single', {
        url: "/:id",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          content: {
            templateUrl: "src/app/sellcampaigns/SellCampaign.tpl.html",
            controller: "SellCampaignCtrl"
          }
        },
        abstract: true,
        breadcrumb: {
          displayName: '{{ sellCampaign.name }}'
        },
        resolve: {
          sellCampaign: function(SellCampaign, $stateParams) {
            return SellCampaign.getSellCampaignById($stateParams.id);
          }
        }
      })
      .state('SellCampaignsUIRoot.single.info', {
        url: "",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          subContent: {
            templateUrl: "src/app/sellcampaigns/info/SellCampaignInfo.tpl.html",
            controller: "SellCampaignInfoCtrl"
          }
        }
      })
      .state('SellCampaignsUIRoot.single.rotation', {
        url: "/rotation",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          subContent: {
            templateUrl: "src/app/sellcampaigns/rotation/SellCampaignRotation.tpl.html",
            controller: "SellCampaignRotationCtrl"
          }
        }
      })
      .state('SellCampaignsUIRoot.single.ruleset', {
        url: "/ruleset",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          subContent: {
            templateUrl: "src/app/sellcampaigns/ruleset/SellCampaignRuleSet.tpl.html",
            controller: "SellCampaignRuleSetCtrl"
          }
        }
      })

// Von Sell Campaign revamp END
      .state('SellCampaign',{
        url: "/inventory/sellcampaigns",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body":
            {
              templateUrl: "src/app/inventory/templates/sellcampaigns.tpl.html",
              controller : "ListInventoryCtrl"
            }
        },
        data: {
            access: AccessLevels.user
        }
      })
      .state('SellCampaign.id',{
        url: "/:id"
      })
// Buy campaigns MMC: START
      .state('BuyCampaignsUIRoot', {
        url: "/buycampaigns",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          body: {
            templateUrl: "src/app/buycampaigns/BuyCampaigns.tpl.html",
            controller: "BuyCampaignsCtrl"
          }
        },
        abstract: true,
        breadcrumb: {
          displayName: 'Buy Campaigns'
        }
      })
      .state('BuyCampaignsUIRoot.index', {
        url: "",
        params: {msg: null},
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          content: {
            templateUrl: "src/app/buycampaigns/BuyCampaignsList.tpl.html",
            controller: "BuyCampaignsListCtrl"
          }
        },
      })
      .state('BuyCampaignsUIRoot.create', {
        url: "/new",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          content: {
            templateUrl: "src/app/buycampaigns/BuyCampaignsCreate.tpl.html",
            controller: "BuyCampaignsCreateCtrl"
          }
        },
        breadcrumb: {
          displayName: 'New'
        }
      })
      .state('BuyCampaignsUIRoot.single', {
        url: "/:id",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          content: {
            templateUrl: "src/app/buycampaigns/BuyCampaign.tpl.html",
            controller: "BuyCampaignCtrl"
          }
        },
        abstract: true,
        breadcrumb: {
          displayName: '{{ buyCampaign.name }}'
        },
        resolve: {
          buyCampaign: function(BuyCampaign, $stateParams) {
            return BuyCampaign.getBuyCampaign($stateParams.id);
          }
        }
      })
      .state('BuyCampaignsUIRoot.single.info', {
        url: "",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          subContent: {
            templateUrl: "src/app/buycampaigns/BuyCampaignInfo.tpl.html",
            controller: "BuyCampaignInfoCtrl"
          }
        }
      })
// Buy campaigns MMC: END
// Advertiser START
        .state('AdvertisersUIRoot', {
          url: "/advertisers",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            body: {
              templateUrl: "src/app/advertisers/Advertisers.tpl.html",
              controller: "AdvertisersCtrl"
            }
          },
          abstract: true,
          breadcrumb: {
            displayName: 'Advertisers'
          }
        })
        .state('AdvertisersUIRoot.index', {
          url: "",
          params: {msg: null},
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            content: {
              templateUrl: "src/app/advertisers/AdvertisersList.tpl.html",
              controller: "AdvertisersListCtrl"
            }
          },
        })
        .state('AdvertisersUIRoot.create', {
          url: "/new",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            content: {
              templateUrl: "src/app/advertisers/AdvertisersCreate.tpl.html",
              controller: "AdvertisersCreateCtrl"
            }
          },
          breadcrumb: {
            displayName: 'New'
          }
        })
        .state('AdvertisersUIRoot.single', {
          url: "/:id",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            content: {
              templateUrl: "src/app/advertisers/Advertiser.tpl.html",
              controller: "AdvertiserCtrl"
            }
          },
          abstract: true,
          breadcrumb: {
            displayName: '{{ advertiser.name }}'
          },
          resolve: {
            advertiser: function(Advertiser, $stateParams) {
              return Advertiser.getAdvertiser($stateParams.id);
            }
          }
        })
        .state('AdvertisersUIRoot.single.info', {
          url: "",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            subContent: {
              templateUrl: "src/app/advertisers/AdvertiserInfo.tpl.html",
              controller: "AdvertiserInfoCtrl"
            }
          }
        })
        .state('AdvertisersUIRoot.single.campaigns', {
          url: "",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            subContent: {
              templateUrl: "src/app/advertisers/AdvertiserInfo.tpl.html",
              controller: "AdvertiserInfoCtrl"
            }
          }
        })

// advertiser END
// TemplateVar START
        .state('TemplateVariablesUIRoot', {
          url: "/templatevariables",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            body: {
              templateUrl: "src/app/templatevars/TemplateVars.tpl.html",
              controller: "TemplateVariablesCtrl"
            }
          },
          abstract: true,
          breadcrumb: {
            displayName: 'Template Variables'
          }
        })
        .state('TemplateVariablesUIRoot.index', {
          url: "",
          params: {msg: null},
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            content: {
              templateUrl: "src/app/templatevars/TemplateVarsList.tpl.html",
              controller: "TemplateVariablesListCtrl"
            }
          },
        })
        .state('TemplateVariablesUIRoot.create', {
          url: "/new",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            content: {
              templateUrl: "src/app/templatevars/TemplateVarsCreate.tpl.html",
              controller: "TemplateVariablesCreateCtrl"
            }
          },
          breadcrumb: {
            displayName: 'New'
          }
        })
        .state('TemplateVariablesUIRoot.single', {
          url: "/:id",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            content: {
              templateUrl: "src/app/templatevars/TemplateVar.tpl.html",
              controller: "TemplateVariableCtrl"
            }
          },
          abstract: true,
          breadcrumb: {
            displayName: '{{ templateVariable.name }} - {{templateVariable.id}}'
          },
          resolve: {
            templateVariable: function(TemplateVariable, $stateParams) {
              return TemplateVariable.getTemplateVariable($stateParams.id);
            }
          }
        })
        .state('TemplateVariablesUIRoot.single.info', {
          url: "",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            subContent: {
              templateUrl: "src/app/templatevars/TemplateVarInfo.tpl.html",
              controller: "TemplateVariableInfoCtrl"
            }
          }
        })
//templatevar END
// RuleEnumValue START
        .state('RuleEnumValueUIRoot', {
          url: "/ruleenumvalues",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            body: {
              templateUrl: "src/app/enumvalues/EnumValues.tpl.html",
              controller: "RuleEnumValuesCtrl"
            }
          },
          abstract: true,
          breadcrumb: {
            displayName: 'Rule Enum Values'
          }
        })
        .state('RuleEnumValueUIRoot.index', {
          url: "",
          params: {msg: null},
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            content: {
              templateUrl: "src/app/enumvalues/EnumValuesList.tpl.html",
              controller: "RuleEnumValuesListCtrl"
            }
          },
        })
        .state('RuleEnumValueUIRoot.create', {
          url: "/new",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            content: {
              templateUrl: "src/app/enumvalues/EnumValuesCreate.tpl.html",
              controller: "RuleEnumValuesCreateCtrl"
            }
          },
          breadcrumb: {
            displayName: 'New'
          }
        })
        .state('RuleEnumValueUIRoot.single', {
          url: "/:typeName/:enumDisplayString",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            content: {
              templateUrl: "src/app/enumvalues/EnumValue.tpl.html",
              controller: "RuleEnumValueCtrl"
            }
          },
          abstract: true,
          breadcrumb: {
            displayName: '{{ ruleEnumValue.enumDisplayString }}'
          },
          resolve: {
            ruleEnumValue: function(RuleEnumValue, $stateParams) {
              return RuleEnumValue.getRuleEnumValue($stateParams);
            }
          }
        })
        .state('RuleEnumValueUIRoot.single.info', {
          url: "",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            subContent: {
              templateUrl: "src/app/enumvalues/EnumValueInfo.tpl.html",
              controller: "RuleEnumValueInfoCtrl"
            }
          }
        })
//RuleEnumValue END
//Creative START
        .state('CreativeUIRoot', {
          url: "/creatives",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            body: {
              templateUrl: "src/app/creatives/Creatives.tpl.html",
              controller: "CreativesCtrl"
            }
          },
          abstract: true,
          breadcrumb: {
            displayName: 'Creative Values'
          }
        })
        .state('CreativeUIRoot.index', {
          url: "",
          params: {msg: null},
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            content: {
              templateUrl: "src/app/creatives/CreativesList.tpl.html",
              controller: "CreativesListCtrl"
            }
          },
        })
        .state('CreativeUIRoot.create', {
          url: "/new",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            content: {
              templateUrl: "src/app/creatives/CreativesCreate.tpl.html",
              controller: "CreativesCreateCtrl"
            }
          },
          breadcrumb: {
            displayName: 'New'
          }
        })
        .state('CreativeUIRoot.single', {
          url: "/:id",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            content: {
              templateUrl: "src/app/creatives/Creative.tpl.html",
              controller: "CreativeCtrl"
            }
          },
          abstract: true,
          breadcrumb: {
            displayName: '{{ creative.name }}'
          },
          resolve: {
            creative: function(Creative, $stateParams) {
              return Creative.getCreative($stateParams);
            }
          }
        })
        .state('CreativeUIRoot.single.info', {
          url: "",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            subContent: {
              templateUrl: "src/app/creatives/CreativeInfo.tpl.html",
              controller: "CreativeInfoCtrl"
            }
          }
        })
//Creative END
        .state('BuyCampaign',{
        url: "/inventory/buycampaigns",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body":
          {
            templateUrl: "src/app/inventory/templates/buycampaigns.tpl.html",
            controller : "ListInventoryCtrl"
          }
        },
        data: {
            access: AccessLevels.user
        }
      })
      .state('BuyCampaign.id',{
        url: "/:id"
      })
      .state('Creative',{
        url: "/inventory/creatives",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": {
             templateUrl: "src/app/inventory/templates/creatives.tpl.html",
             controller : "ListInventoryCtrl"
           }
        },
        data: {
            access: AccessLevels.user
        }
      })
      .state('Creative.id',{
        url: "/:id"
      })

// Rotations START
      .state('RotationsUIRoot', {
        url: "/rotations",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          body: {
            templateUrl: "src/app/rotations/Rotations.tpl.html",
            controller: "RotationsCtrl"
          }
        },
        abstract: true,
        breadcrumb: {
          displayName: 'Rotations'
        }
      })
      .state('RotationsUIRoot.index', {
        url: "",
        params: {msg: null},
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          content: {
            templateUrl: "src/app/rotations/RotationsList.tpl.html",
            controller: "RotationsListCtrl"
          }
        },
      })
      .state('RotationsUIRoot.create', {
        url: "/new",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          content: {
            templateUrl: "src/app/rotations/new/RotationsCreate.tpl.html",
            controller: "RotationsCreateCtrl"
          }
        },
        breadcrumb: {
          displayName: 'New'
        }
      })
      .state('RotationsUIRoot.single', {
        url: "/:id",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          content: {
            templateUrl: "src/app/rotations/Rotation.tpl.html",
            controller: "RotationCtrl"
          }
        },
        abstract: true,
        breadcrumb: {
          displayName: '{{ oneRotation.data.name }}'
        },
        resolve: {
          oneRotation: function(Rotation, $stateParams) {
            return Rotation.getRotation($stateParams.id);
          }
        }
      })
      .state('RotationsUIRoot.single.info', {
        url: "",
        views: {
          header: { templateUrl: "src/app/header/header.tpl.html" },
          subContent: {
            templateUrl: "src/app/rotations/info/RotationInfo.tpl.html",
            controller: "RotationInfoCtrl"
          }
        }
      })
//Rotaions END
//RuleSets BEGIN
        .state('RuleSetUIRoot', {
          url: "/rulesets",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            body: {
              templateUrl: "src/app/rulesets/RuleSets.tpl.html",
              controller: "RuleSetsCtrl"
            }
          },
          abstract: true,
          breadcrumb: {
            displayName: 'RuleSets'
          }
        })
        .state('RuleSetUIRoot.index', {
          url: "",
          params: {msg: null},
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            content: {
              templateUrl: "src/app/rulesets/RuleSetsList.tpl.html",
              controller: "RuleSetsListCtrl"
            }
          },
        })
        .state('RuleSetUIRoot.create', {
          url: "/new",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            content: {
              templateUrl: "src/app/rulesets/RuleSetsCreate.tpl.html",
              controller: "RuleSetsCreateCtrl"
            }
          },
          breadcrumb: {
            displayName: 'New'
          }
        })
        .state('RuleSetUIRoot.single', {
          url: "/:id",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            content: {
              templateUrl: "src/app/rulesets/RuleSet.tpl.html",
              controller: "RuleSetCtrl"
            }
          },
          abstract: true,
          breadcrumb: {
            displayName: '{{ ruleset.name }}'
          },
          resolve: {
              ruleset: function(RuleSetEnt, $stateParams) {
              return RuleSetEnt.getRuleSet($stateParams.id);
            }
          }
        })
        .state('RuleSetUIRoot.single.info', {
          url: "",
          views: {
            header: { templateUrl: "src/app/header/header.tpl.html" },
            subContent: {
              templateUrl: "src/app/rulesets/RuleSetInfo.tpl.html",
              controller: "RuleSetInfoCtrl"
            }
          }
        })
//RuleSets END
      .state('Rotation',{
        url: "/inventory/rotations",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": {
            templateUrl: "src/app/inventory/templates/rotations.tpl.html",
            controller : "ListInventoryCtrl"
          }
        },
        data: {
            access: AccessLevels.user
        }
      })
      .state('Rotation.id',{
        url: "/:id"
      })
      .state('RuleSet',{
        url: "/inventory/rulesets",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": {
            templateUrl: "src/app/inventory/templates/rulesets.tpl.html",
            controller : "ListInventoryCtrl"
          }
        },
        data: {
            access: AccessLevels.user
        }
      })
      .state('RuleSet.id',{
        url: "/:id",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": {
            templateUrl: "src/app/inventory/templates/rulesets.tpl.html",
            controller : "ListInventoryCtrl"
          }
        }
      })
      .state('TemplateVar',{
        url: "/inventory/templatevariables",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": {
            templateUrl: "src/app/inventory/templates/templatevariables.tpl.html",
            controller : "ListInventoryCtrl"
          }
        },
        data: {
            access: AccessLevels.user
        }
      })
      .state('TemplateVar.id',{
        url: "/:id"
      })
      .state('RulesEnumValues',{
        url: "/inventory/rulesenumvalues",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": {
            templateUrl: "src/app/inventory/templates/rulesenumvalues.tpl.html",
            controller : "ListInventoryCtrl"
          }
        },
        data: {
            access: AccessLevels.user
        }
      })
      .state('RulesEnumValues.id',{
        url: "/:id"
      })
      // Analytics admin (saved reports management)
      .state('analyticsadmin', {
        url: "/g/analyticsadmin",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": {
            templateUrl: "src/app/analytics/admin/templates/analyticsadmin.tpl.html",
            controller: "AnalyticsAdminCtrl"
          }
        },
        data: {
            access: AccessLevels.user
        }
      })
      // Group entity analytics
      .state('entities_list',{
        url: "/g/analytics",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": {
            templateUrl: "src/app/analytics/entities/templates/analyticslist.tpl.html",
            controller: "EntitiesListCtrl"
          }
        },
        data: {
            access: AccessLevels.user
        }
      })

      // Single entity analytics
      .state('entities_single',{
        url: "/g/analytics/single/:entity/:id",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": {
            templateUrl: "src/app/analytics/entities/templates/analyticslist.tpl.html",
            controller: "EntityCtrl"
          }
        },
        data: {
            access: AccessLevels.user
        }
      })

      .state('edit_report_definition',{
        url: "/g/editreportdefinition/{reportName}",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": { templateUrl: "src/app/analytics/customreport/templates/reportdefinitioneditor.tpl.html" }
        },
        data: {
            access: AccessLevels.user
        }
      })
      .state('edit_report_definitions',{
        url: "/g/editreportdefinition/",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": { templateUrl: "src/app/analytics/customreport/templates/reportdefinitioneditor.tpl.html" }
        },
        data: {
            access: AccessLevels.user
        }
      })
      .state('entities_list_wt_entity',{
        url: "/g/analytics/{entity}",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": {
            templateUrl: "src/app/analytics/entities/templates/analyticslist.tpl.html",
            controller: "EntitiesListCtrl"
          }
        },
        data: {
            access: AccessLevels.user
        }
      })
      .state('entities_list_wt_entity_savedReportId',{
        url: "/g/analytics/{entity}/{savedReportId}",
        views: {
          "header": { templateUrl: "src/app/header/header.tpl.html" },
          "body": {
            templateUrl: "src/app/analytics/entities/templates/analyticslist.tpl.html",
            controller: "EntitiesListCtrl"
          }
        },
        data: {
            access: AccessLevels.user
        }
      })
      .state('signup', {
        url: '/signup',
          views: {
            "header": { template: "" },
            "body": {
              templateUrl: "src/app/login/signup.tpl.html",
              controller: "LoginCtrl"
            }
          },
          data: {
            access: AccessLevels.user
          }
      })
      .state('passwordchange',{
        url: "/changepassword",
          views: {
            "header": { templateUrl: "src/app/header/header.tpl.html" },
            "body": {
              templateUrl: "src/app/login/changepassword.tpl.html",
              controller: "LoginCtrl"
            }
          },
          data: {
            access: AccessLevels.user
          }
      })
      .state('login',{
          url: "/login",
          params: { previous: null },
          views: {
            "header": { template: "" },
            "body": {
              templateUrl: "src/app/login/login.tpl.html",
              controller: "LoginCtrl"
            }
          },
          data: {
            access: AccessLevels.guest
          }
      });

  }])
.run(['$rootScope', '$state', 'AuthService',
  function($rootScope, $state, AuthService) {
    //
    // if not logged in then go to login page.
    //
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'login' || toState.name === 'signup' ) {
          return;
        }

        if (AuthService.isLoggedIn()) {
          return;
        }

        event.preventDefault();
        $state.go('login', { previous: { name: toState.name, params: toParams } });
    })
}]);
