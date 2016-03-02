var inventoryApp = angular.module('InventoryApp');

inventoryApp.controller('ListInventoryCtrl',
  ['$scope','Inventory','$filter','$state','$location','SellCampaign',
    function($scope, Inventory, $filter,$state,$location, SellCampaign){
    
    // copy to scope.
    $scope.SellCampaign = SellCampaign;

    // initialize the alert to false to prevent multiple scopes picking up the
    // alerts in nested windows
    $scope.alerts=null;

    // Alert preparation before it hits the front end
    var error = function (reason)
    {
        $scope.alerts = [];
        if (typeof(reason) == "string")
        {
            var msg =
            {
                message : reason,
                error : reason
            };
            $scope.alerts.push(msg);
        }
        else{
            $scope.alerts.push(reason);
        }
        $scope.alerts.show=true;
    };


    // Allow the view to access the inventory service
    $scope.Inventory = Inventory.getInstance();

    //This sets the error handler with the error received
    $scope.Inventory.setErrorHandler(error);

      /**
     * Generate a function to be called by a child edit forms when the form is
     * saved. The function closes the form and refreshes the view
     * @param obj
     * @param flagName
     * @returns {Function}
     */
    $scope.getOnSaved = function(obj, flagName)
    {
      return function(newObj,justSavedId)
      {
        obj[flagName] = false;

        // In case the item on the list got replaced by the save
        // we have to apply the false to the new instance as well
        try
        {
          newObj[flagName] = false;
        }
        catch(err){}
        // DEV-17684: The list shows the just created entry based on
        // the saved entity id.
        // The list should be filtered only on when it's the top-most view
        // When know that when the parent entity name is not null
        if(!$scope.parentEntityName && justSavedId)
        {
          // set id in search filter
            $scope.search_filter.term = JSON.stringify({ "id": justSavedId });
          // set the id in the URL
            $scope.updateLocation(justSavedId);
            $scope.refresh();
        }
        $scope.reload();
      };
    };

    /**
     * Generate a function to be called by a child edit forms when the form is
     * canceled. The function closes the form without refreshing the view
     * @param obj
     * @param flagName
     * @returns {Function}
     */
    $scope.getOnCanceled = function(obj, flagName)
    {
      return function()
      {
        obj[flagName] = false;
      };
    };

    // The source data from the server
    var dataFromServer = [];

    // In case we are nested, this is the data provided by the parent
    var dataFromParent = null;

    //This variable will be filled with data we want to go in the table UI
    $scope.tableData = null;

    // when this property is set to true, the list does not show disabled items
    $scope.disabled = true;

    // the current displayed page number
    $scope.page = 1;

    // the number of rows on a page
    $scope.count = 10;

    // total number of records in the result set (after applying column filters)
    $scope.total = 0;

    // array of page buttons descriptors (see setPages)
    $scope.pages = Array();

    $scope.dataFromParent = null;

    // the current sorting column
    var orderByHeaderName = null;

    // the current sorting direction
    var orderByDirection = null;

    // stores the values of search filter. We define it as an object rather than
    // a string to make sure that child scopes which are created by AngularJS
    // may also access it.
    // See http://jimhoskins.com/2012/12/14/nested-scopes-in-angularjs.html
    $scope.search_filter = {
      "term" : null
    };

    $scope.reload = function()
    {
      // We got the list of items from the parent (not from the server)
      // therefore we should not reload any data from the server
      if(dataFromParent instanceof Array)
      {
        $scope.refresh();
      }
      else
      {
        var promise = $scope.Inventory.load($scope.entityName);
        promise.then(
          function(data){
            dataFromServer = data;
            $scope.refresh();
          },error
        );
      }
    };

    /**
     * Called by ng-init which is defined on the template that uses
     * this controller
     */
    $scope.init = function(entityName, Data, parentEntityName, parentEntityData)
    {
      // we were already initialized by the parent, no need for second time by
      // the list view
      if(dataFromParent != null)
        return;

      // The entity name e.g. SellCampaign. This should be one of the Inventory
      // consts
      $scope.entityName = entityName;


      if(typeof(parentEntityName) == "undefined")
        parentEntityName = null;

      if(typeof(parentEntityData) == "undefined")
        parentEntityData = null;

      if(Data instanceof Array){
        dataFromParent = Data;
        $scope.dataFromParent = Data;
      }
      // If this is a top level view and the URL contains an id, then set it
      // as a search term
      if(parentEntityName === null && typeof($state.params.id) == "string")
      {
        // if the parameter is a number, assume it is an id and set a more
        // specific search
        if($state.params.id.match(/^\d+$/))
        {
          $scope.search_filter.term = "{\"id\":"+$state.params.id+"}";
        }
        // else use it as is
        else
        {
          $scope.search_filter.term = decodeURIComponent($state.params.id);
        }
      }


      // If the entity is edited in the context of a parent entity e.g.
      // RuleSet in the context of SellCampaign this is the name of the parent
      // one of Inventory consts
      $scope.parentEntityName = parentEntityName;
      $scope.parentEntityData = parentEntityData;

      $scope.reload();
      $scope.$watchCollection("dataFromParent", function(){
        $scope.refresh();
      })
    };


  /**
   * For top level views, this function updates the :id in the URL based on the
   * search term.
   *
   * @param search_filter
   */
    $scope.updateLocation = function(search_filter)
    {
      try
      {
        // If the search term is an object e.g. {"id":630}
        if (typeof(search_filter) == "object" && search_filter != null)
        {
          // in case the object has an id, then use the id
          // e.g. /publishers/630
          if (search_filter.id) {
            search_filter = search_filter.id;
          }
          // else, convert the object to JSON string
          else {
            search_filter = JSON.stringify(search_filter);
          }
        }

        if(search_filter)
        {
          search_filter = encodeURIComponent(search_filter);
          $state.go($scope.entityName + ".id", {"id": search_filter});
        }
        else
        {
          $state.go($scope.entityName);
        }
      }
      catch (e) {}
    };

    /**
     * Refreshes the table data (complete data set) and pagination bar
     */
    $scope.refresh = function()
    {
      var data = (dataFromParent instanceof Array) ?
        dataFromParent : dataFromServer;

      if(!(data instanceof Array))
        return;

      var search_filter = null;

      // if a search filter is defined, we have to fiter the list
      if($scope.search_filter.term != null && $scope.search_filter.term != "")
      {
        // check if the search term is a JSON object.
        // Allow the user to specify something like {"id":614} for very
        // specific search term.
        try
        {
          search_filter = JSON.parse($scope.search_filter.term);
        }
        catch(err)
        {}

        if(typeof(search_filter) != "object" || search_filter === null)
        {
          search_filter = $scope.search_filter.term;
        }

        data = $filter('filter')(data, search_filter);
      }
      else
      {
        data = data.slice(0);
      }

      // If this is the top level view, then update the location base on
      // the search term
      if($scope.parentEntityName === null)
      {
        $scope.updateLocation(search_filter);
      }

      if($scope.disabled === true)
      {
          data = $filter('filter')(data, function (value, index) {
              if(value.enabled == 1 || value.enabled === true){
                  return true;
              }
              return false;
          });
      }

      if(orderByHeaderName != null)
      {
        var direction = ((orderByDirection == "sort-asc")? false:true);
        data = $filter('orderBy')(data, orderByHeaderName, direction);
      }

      $scope.total = data.length;
      setPages();
      refreshTableData(data);
    };


    /**
     * Refreshes the portion of the table to be displayed
     * @param data - optional and array of rows, if null the refresh will use
     *               the data from the parent controller
     */
    var refreshTableData = function(data)
    {
      var dataSlice = data.slice(($scope.page - 1) * $scope.count, $scope.page * $scope.count);
     
      _.mapValues(dataSlice, function (i) {
        if(i.id){
          i.id = parseFloat(i.id);
        }
        if(i.ownerId){
          i.ownerId = parseFloat(i.ownerId);
        }
        if(i.defaultRotationId){
          i.defaultRotationId = parseFloat(i.defaultRotationId);
        }
        if(i.height){
          i.height = parseFloat(i.height);
        }
        if(i.width){
          i.width = parseFloat(i.width);
        }
        if(i.priority){
          i.priority = parseFloat(i.priority);
        }
        if(i.percentOfTraffic){
          i.percentOfTraffic = parseFloat(i.percentOfTraffic);
        }      
      });

      // The data structure that is used by the UI template
      $scope.tableData = dataSlice;
    };


    /**
     * Returns true if the right side bar with optional page size should be
     * displayed
     * @returns {boolean}
     */
    $scope.showPageCount = function()
    {
      return ($scope.total > 10);
    };

    /**
     * Sets a new page size and refreshes the table
     * @param newPageCount
     */
    $scope.setPageCount = function(newPageCount)
    {
      if(newPageCount != $scope.count)
      {
        $scope.count = newPageCount;

        // Persist user's selection
        if(typeof(Storage)!=="undefined")
        {
          try {
            localStorage.setItem("customReportTableCtrl.count", $scope.count);
          } catch (e)
          {
          }
        }
        $scope.refresh();
      }
    };

    $scope.showPaginationBar = function()
    {
      return $scope.count < $scope.total;
    };

    var getNumPages = function()
    {
      return ($scope.total % $scope.count == 0)?
        ($scope.total / $scope.count) : Math.floor($scope.total / $scope.count) + 1;
    };

    /**
     * Sets the scope array of pages. Each element of the array tels the UI template
     * how to render the page button.
     * Each page element is formatted as
     * {
     *  "label"  : < the button label >,
     *  "active" : <true when the button is active>,
     *  "action" : < the page number to activate when the button is clicked >
     * }
     */
    var setPages = function()
    {
      var pages = [];
      try {
        var numPages = getNumPages();

        if($scope.page > numPages)
        {
          $scope.page = numPages > 0 ? numPages : 1;
        }

        if(numPages > 1)
        {
          pages.push({"label":"<<", "active" : ($scope.page > 1), "number" : $scope.page - 1});

          if(numPages < 10)
          {
            for(var i = 1;i <= numPages;i++)
            {
              pages.push({"label": i.toString(), "active" : ($scope.page != i), "number" : i});
            }
          }
          else
          {
            var begin = ($scope.page - 4 >= 1)? $scope.page - 4: 1;
            var end   = ($scope.page + 4 <= numPages)? $scope.page + 4: numPages;
            if(end - begin != 8 && end == numPages)
            {
              begin = end - 8;
            }
            else if(end - begin != 8 && begin == 1)
            {
              end = 9;
            }
            if(begin > 1)
            {
              pages.push({"label": "1..", "active" : ($scope.page != 1), "number" : 1});
            }
            for(var i = begin;i <= end;i++)
            {
              pages.push({"label": i.toString(), "active" : ($scope.page != i), "number" : i});
            }
            if(end < numPages)
            {
              pages.push({"label": ".." + numPages, "active" : ($scope.page != numPages), "number" : numPages});
            }
          }

          pages.push({"label":">>", "active" : ($scope.page < numPages), "number" : $scope.page + 1});
        }
      }
      catch (e)
      {
        $scope.pages = [];
      }

      $scope.pages = pages;
    };

    $scope.setPage = function(number)
    {
      if(number >= 1 && number <= getNumPages())
      {
        $scope.page = number;

        $scope.refresh();
      }
    };

    $scope.getRowCss = function(row)
    {
      return (row.enabled == 1 || row.enabled == true)?
        "inventory-entityEnabled" : "inventory-entityDisabled";
    };

    $scope.getHeaderCssClass = function(columnName)
    {
      var className = " sortable ";
      if(columnName == orderByHeaderName)
        className += orderByDirection;

      return className;
    };

    /**
     * Sorting function for column
     *
     * @param col
     */
    $scope.sort = function(columnName, event)
    {
      // For some reason, when we click on the column filter input the on-click
      // is triggered. I found out that when clicking on the column header, the
      // event is populated but when I click on the input the event is not.
      // I used this as a workaround
      if(event == null || typeof(event) == "undefined")
      {
        return;
      }

      if(columnName != orderByHeaderName)
      {
        orderByDirection = "sort-asc";
      }
      else
      {
        orderByDirection = (orderByDirection == "sort-asc")?
          "sort-desc" : "sort-asc";
      }

      orderByHeaderName = columnName;

      $scope.refresh ();
    };


    $scope.delete = function(entityId, hard, index)
    {
      if(typeof(hard) != "boolean")
        hard = false;

      var promise = null;

      // We can only delete in database if the entity has valid id
      if (typeof(entityId) != "undefined" && entityId != null)
      {
        promise = $scope.Inventory.delete(
          $scope.entityName, entityId, $scope.parentEntityData, hard);
      }
      else
      {
        // In case we are nested in a parent we have to manually remove the
        // entry from the array provided by the parent
        // (100 light-years a way from perfect)
        if(dataFromParent instanceof Array)
        {
          if(typeof(index) != "undefined" && index >= 0 && index < dataFromParent.length)
          {
            dataFromParent.splice(index,1);
          }
        }
      }

      if(promise != null)
      {
        promise.then(
          function(data){
            // In case we are nested in a parent scope and the view sends direct
            // command, we have to manually remove the entry from the array provided
            // by the parent (100 light-years a way from perfect)
            if(dataFromParent instanceof Array)
            {
              for(var i = 0;i < dataFromParent.length;i++)
              {
                if(dataFromParent[i].id == entityId)
                {
                  dataFromParent.splice(i,1);
                  break;
                }
              }
            }

            $scope.reload();
          },error
        );
      }
      else
      {
        $scope.reload();
      }
    };

    /**
     * Returns true if the list is currently nested with in a parent scope
     * @returns {boolean}
     */
    $scope.isNested = function()
    {
      return (dataFromParent instanceof Array);
    };

    $scope.showSearch = function()
    {
      var data = (dataFromParent instanceof Array) ?
          dataFromParent : dataFromServer;

      var searchTerm = 0;
      try{searchTerm = $scope.search_filter.term.length;}catch(err){searchTerm = 0;}

      var show = data instanceof Array &&
                (data.length >= 10 || searchTerm > 0);

      return show;
    };

    $scope.sendErrorLog = function (alert)
    {
      var subject = "";
      var message = "";

      try
      {
        subject = alert[0].status + ": " + alert[0].message;
        if(subject.length > 1500)
          subject = subject.substring(0,1500);
      }
      catch (e)
      {
        subject = "fail to generate email subject";
      }
      try
      {
        message = "URL: " + alert[0].url + "\n" + "\n" +
          alert[0].error + "\n" + "\n" + alert[0].trace;
      }
      catch (e)
      {
        message = "fail to generate body";
      }

      if(subject.length + message.length > 1500)
      {
        message = message.substring(0, (1500 - subject.length));
      }


      var email = "mailto:advertising-tech@flyingcroc.net?"
        + "&subject=" + encodeURI(subject)
        + "&body=" + encodeURI(message);

      window.location.href = email;//encodeURI
    };

  }]);