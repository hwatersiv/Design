var entitiesModule = angular.module('marketplace.entities');

entitiesModule.factory('SellCampaign', 
  function(AppConstants, $q, $http) {
    var SellCampaign = {};

    SellCampaign.sellCampaigns = [];

    SellCampaign.POOL = {
      ALL: 2,
      KEEP: 1,
      SELL: 0
    };

    SellCampaign.POOL_OPTIONS = _.invert(SellCampaign.POOL);
    SellCampaign.POOL_OPTIONS[SellCampaign.POOL.ALL] = 'All Traffic';
    SellCampaign.POOL_OPTIONS[SellCampaign.POOL.KEEP] = 'Keep Traffic';
    SellCampaign.POOL_OPTIONS[SellCampaign.POOL.SELL] = 'Sell Traffic';

    SellCampaign.STRATEGY = {
      MANUAL: 4,
      ASAP100: 3,
      PCT_UNTIL_END: 2,
      PCT_UNTIL_MAX: 1,
      IMP_OVER_TIME: 0
    };

    SellCampaign.STRATEGY_OPTIONS = _.invert(SellCampaign.STRATEGY);
    SellCampaign.STRATEGY_OPTIONS[SellCampaign.STRATEGY.MANUAL] = 'Mannually set values';
    SellCampaign.STRATEGY_OPTIONS[SellCampaign.STRATEGY.ASAP100] = '100% ASAP';
    SellCampaign.STRATEGY_OPTIONS[SellCampaign.STRATEGY.PCT_UNTIL_END] = 'By % of impressions until end date';
    SellCampaign.STRATEGY_OPTIONS[SellCampaign.STRATEGY.PCT_UNTIL_MAX] = 'By % of impressions until max count';
    SellCampaign.STRATEGY_OPTIONS[SellCampaign.STRATEGY.IMP_OVER_TIME] = 'Impressions count over time';


    SellCampaign.getAllSellCampaigns = function () {
      var url = AppConstants.apiBaseURL + "sellcampaigns";

      return $http.get(url).then(function (res) {
        SellCampaign.sellCampaigns = res.data;
        return res;
      });
    };

    SellCampaign.getSellCampaignById = function (id) {
      var url = AppConstants.apiBaseURL + "sellcampaigns/" + id;

      return $http.get(url).then(function (res) {
        var sellCampaign = res.data;
        // var makeDate = function (unixDate) { return Math.floor(Date.now(unixDate) / 1000) };

        // sellCampaign.startDate = makeDate(sellCampaign.startDate);
        // sellCampaign.endDate = makeDate(sellCampaign.endDate);
        // sellCampaign.createDate = makeDate(sellCampaign.createDate);
        // sellCampaign.versionNumber = makeDate(sellCampaign.versionNumber);
        // sellCampaign.ruleSet.createDate = makeDate(sellCampaign.ruleSet.createDate);
        // sellCampaign.ruleSet.versionNumber = makeDate(sellCampaign.ruleSet.versionNumber);
        // for (var i = sellCampaign.ruleSet.rules.length - 1; i >= 0; i--) {
        //   sellCampaign.ruleSet.rules[i].createDate = makeDate(sellCampaign.ruleSet.rules[i].createDate);
        // };
        // sellCampaign.rotation.createDate = makeDate(sellCampaign.rotation.createDate);
        // sellCampaign.rotation.versionNumber = makeDate(sellCampaign.rotation.versionNumber);
        // for (var i = sellCampaign.rotation.creatives.length - 1; i >= 0; i--) {
        //   sellCampaign.rotation.creatives[i].createDate = makeDate(sellCampaign.rotation.creatives[i].createDate);
        //   sellCampaign.rotation.creatives[i].versionNumber = makeDate(sellCampaign.rotation.creatives[i].versionNumber);
        // };

        return res.data;
      });
    };
    /*
     *
     * @returns pool used to select traffic to be sold
     */
    SellCampaign.getPoolByPriority = function(priority) {
        priority = parseInt(priority);

        if(isNaN(priority))
            return 0;

        return Math.floor((priority) / 5);
    };

    /*
     *
     * @returns strategy used to select traffic to be sold
     */
    SellCampaign.getStrategyByPriority = function(priority) {
        priority = parseInt(priority);

        if(isNaN(priority))
            return 0;

        return priority % 5;
    };

    /*
     * Calculate a priority to send to the AdRouter based on the desired
     * traffic restrictions
     *
     * @returns priority for a given `pool` and `strategy`
     */
    SellCampaign.getPriorityByDeliveryMethod = function(pool, strategy) {
        pool = parseInt(pool);
        pool = isNaN(pool) ? 0 : pool;

        strategy = parseInt(strategy);
        strategy = isNaN(strategy) ? 2 : strategy;

        return 5 * pool + strategy;
    };

    SellCampaign.save = function(sellCampaign) {
      if(!sellCampaign) {
        return $q.reject('SellCampaign is empty');
      }

      switch(sellCampaign.strategy) {
        // Buy ASAP
        case SellCampaign.STRATEGY.ASAP100:
          // ASAP means 100% of the traffic
          sellCampaign.percentOfTraffic = 100;
          break;
        // Buy Type % over time
        case SellCampaign.STRATEGY.PCT_UNTIL_END:
          if(sellCampaign.percentOfTraffic <= 0 || sellCampaign.percentOfTraffic >= 100) {
            return $q.reject("For buy type % over time, \"Traffic Percentage\" must be between 1 to 99");
          }
          break;
        case SellCampaign.STRATEGY.PCT_UNTIL_MAX:
          if(sellCampaign.percentOfTraffic <= 0 || sellCampaign.percentOfTraffic >= 100) {
              return $q.reject("For buy type % to Impressions, \"Traffic Percentage\" must be between 1 to 99");
          }

          if(sellCampaign.absoluteQuota <= 0) {
              return $q.reject("For buy type % to Impressions, quota must be > 0");
          }
          break;
        case SellCampaign.STRATEGY.IMP_OVER_TIME:
          if(sellCampaign.absoluteQuota <= 0) {
              return $q.reject("For buy impressions over time, quota must be > 0");
          }
          if(sellCampaign.endDate == null || sellCampaign.endDate <= 0) {
              return $q.reject("For buy impressions over time, endDate must be set");
          }

          // for buy type impressions over time, % traffic must be disabled
          sellCampaign.percentOfTraffic = 0;
          break;
      }

      // set the priority based on the pool and strategy.
      sellCampaign.priority = SellCampaign.getPriorityByDeliveryMethod(
        sellCampaign.pool,
        sellCampaign.strategy);

      // build POST url
      var id = sellCampaign.id ? "/" + sellCampaign.id : "";
      var url = AppConstants.apiBaseURL +
        "advertisers/" +
        sellCampaign.advertiserId +
        "/campaigns" +
        id;
      
      return $http.post(url, sellCampaign);
    }

    return SellCampaign;
});
