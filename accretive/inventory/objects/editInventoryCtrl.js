var inventoryApp = angular.module('InventoryApp');

inventoryApp.controller('EditInventoryCtrl', ['$scope','Inventory','$state', function($scope, Inventory, $state){

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

  // Allow the view to access the inventory service as an instance of itself
  $scope.Inventory = Inventory.getInstance();

  //This sets the error handler with the error received
  $scope.Inventory.setErrorHandler(error);


  /**
   * Generate a function to be called by a child edit forms when the form is
   * saved. The function closes the form.
   *
   * This is ued in places where edit form is nested with in an edit form
   * e.g. edit rotation with in edit sell campaign.
   *
   * @param obj
   * @param flagName
   * @returns {Function}
   */
  $scope.getOnSaved = function(obj, flagName)
  {
    return function(newObj)
    {
      obj[flagName] = false;

      // In case the item on the list got replaced by the save
      // we have to apply the false to the new instance as well
      try
      {
        newObj[flagName] = false;
      }
      catch(err){}
    };
  };

  /**
   * Generate a function to be called by a child edit forms when the form is
   * canceled. The function closes the form.
   *
   * This is ued in places where edit form is nested with in an edit form
   * e.g. edit rotation with in edit sell campaign.
   *
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

  // This property hides the UI form until the data is ready
  var formDataReady = false;

  // Keep track of open child forms. When the counter > 0 the save and cancel
  // buttons should be disabled
  var numOpenChildForms = 0;

  // Maintain a list of $scope.$id of open child forms.
  // We track the list to make sure we don't double count open children since
  // the open function gets called multiple times
  var openChildFormsIds = [];

  $scope.debug = function(obj)
  {
    console.log(JSON.stringify(obj));
  };

  // should be called by the ng-init on the view to setup the entity type
  // and parent (if any)
  $scope.init = function(
    entityName, entity, parentEntityName, parentEntityData, onSaved, onCanceled)
  {

    // Call back functions to the parent view
    $scope.onSaved = onSaved;
    $scope.onCanceled = onCanceled;

    // The entity name e.g. SellCampaign. This should be one of the Inventory
    // consts
    $scope.entityName = entityName;

    // If known the id of the entity (can be null for new items)
    $scope.entityId   =
      (typeof(entity) == "object" && entity != null && typeof(entity.id) != "undefined")?
        entity.id : null;

    // the entity data for editing. will be loaded just before edit
    // see APIs getEntityTemplate method
    $scope.entityEditableData = null;

    // If the entity is edited in the context of a parent entity e.g.
    // RuleSet in the context of SellCampaign this is the name of the parent
    // one of Inventory consts
    $scope.parentEntityName = parentEntityName;

    // The parent data. When we are editing a child element in the context of
    // a parent e.g. RuleSet in the context of SellCampaign, this is a reference
    // to the parent
    $scope.parentEntityData = parentEntityData;

    // Editable entities must be instantiated by the server using the
    // /api/v1.0/entities_template APIs
    // If the provided entity was already created by the server as editable
    // entity we can use it as is
    if($scope.Inventory.isEditableEntity(entity))
    {
      $scope.entityEditableData = entity;
      // We are adding a temp section to be used by the view as temporary
      // working space. This data is removed before submitting the object
      // to the server
      $scope.entityEditableData.tempData = {};
      formDataReady = true;
    }
    // Otherwise, this might be one of two cases:
    // 1. new object that has not been initialized yet e.g. user clicks on New Rule
    // 2. existing item in db (id != null)
    // in both cases we are loading a template from the server
    else
    {
      // loading the data to be edited
      var promise = $scope.Inventory.getEntityForEdit(
        $scope.entityName, entity, $scope.parentEntityName, $scope.parentEntityData);

      promise.then(
        function(data){
          $scope.entityEditableData = data;
          // We are adding a temp section to be used by the view as temporary
          // working space. This data is removed before submitting the object
          // to the server
          $scope.entityEditableData.tempData = {};
          formDataReady = true;
        },
        error);
    }
  };

  /**
   * Must be call by the view by the ng-show of the edit form.
   *
   * This method serves two purposes
   *
   * 1. make sure the form will be visible only when the data to be edited is
   *    ready
   * 2. when the form become visible it notifies parent form that a child is being
   *    opened and therefore the save/canceled buttons should become disabled
   *
   * @returns {boolean}
   */
  $scope.open = function()
  {
    if(formDataReady)
    {
      $scope.$emit('editInventoryCtrl:childFormOpen',$scope.$id);
      return true;
    }

    return false;
  };

  $scope.clone = function () {
      // This is the call we need to make and add an extra boolean parameter for clone
      var promise = $scope.Inventory.getEntityForEdit($scope.entityName, $scope.entityEditableData.tempData.cloneCampaign, $scope.parentEntityName, $scope.parentEntityData, true);

      promise.then(
          function(data){
              $scope.entityEditableData = data;
              $scope.entityEditableData.tempData = {};
              formDataReady = true;
          },
          error);
  };

  $scope.save = function()
  {
    numOpenChildForms = 1;
    $scope.disableSubmit();
    numOpenChildForms = 0;

    // When this form has associated child forms opened, it cannot be saved
    if(numOpenChildForms > 0)
    {
      return;
    }

    // we create a clone of the editable data since the save method alters the
    // object. This is done in order to make sure that in case of a failure the
    // state of the form remains as is
    var entityEditableDataForSave = JSON.stringify($scope.entityEditableData);
    entityEditableDataForSave = JSON.parse(entityEditableDataForSave);
    // tempData is created for the use of the view only. It is not part of the
    // object in the database and should be discarded
    delete entityEditableDataForSave.tempData;
    delete entityEditableDataForSave.options;
    var promise = $scope.Inventory.save(
      $scope.entityName, entityEditableDataForSave,
      $scope.parentEntityName, $scope.parentEntityData);

    if(promise != null)
    {
      promise.then(
        function(data){
          // let parent forms know that this is close and their save/cancel
          // buttons can be enabled
          $scope.$emit('editInventoryCtrl:childFormClose', $scope.$id);
          $scope.onSaved(null, data.id);
        },
        error);
    }
    else
    {
      // let parent forms know that this is close and their save/cancel
      // buttons can be enabled
      $scope.$emit('editInventoryCtrl:childFormClose', $scope.$id);
      // The save method replaced the item in the array on which the onSave was
      // listening therefore we have to pass the new instance so it can close
      // the form
      $scope.onSaved(entityEditableDataForSave);
    }

  };

  $scope.cancel = function()
  {
    // When this form has associated child forms opened, it cannot be closed
    if(numOpenChildForms > 0)
    {
      return;
    }

    // let parent forms know that this is close and their save/cancel
    // buttons can be enabled
    $scope.$emit('editInventoryCtrl:childFormClose', $scope.$id);
    $scope.onCanceled();
  };

  /**
   * Returns true when the save/cancel buttons should be disabled
   * @returns {boolean}
   */
  $scope.disableSubmit = function()
  {
    return (numOpenChildForms > 0);
  };


  $scope.$on('editInventoryCtrl:childFormOpen',
    // Expecting the emit to include the $scope.$id of the child form that gets
    // opened
    function(event, data)
    {
      // $emit calls the $on on itself. In this case we have to ignore it
      if($scope.$id == data)
      {
        return;
      }

      // make sure we are not double counting the same child multiple times
      if(openChildFormsIds.indexOf(data) == -1)
      {
        openChildFormsIds.push(data);
        // When a child form is being opened, we increment the counter
        // As long as the counter > 0 this form cannot be saved / canceled
        numOpenChildForms++;
      }

      // We must stop it here so the counter of any parent will not get incremented
      // as well
      event.stopPropagation();
    }
  );

  $scope.$on('editInventoryCtrl:childFormClose',
    // expecting $emit to include the $scope.$id of the child form
    function(event, data)
    {
      // $emit calls the $on on itself. In this case we have to ignore it
      if(data == $scope.$id)
      {
        return;
      }

      // make sure the close event is associated with previously opened child form
      var index = openChildFormsIds.indexOf(data);
      if(index > -1)
      {
        // remove it from the tracked list
        openChildFormsIds.splice(index,1);
        // When a child form is being closed, we decrement the counter
        // As long as the counter > 0 this form cannot be saved / canceled
        numOpenChildForms--;
      }

      // We must stop it here so the counter of any parent will not get decremented
      // as well
      event.stopPropagation();
    }
  );

  $scope.isNested = function()
  {
    // NOTE: for some reason angular does not like the short form of
    // returning the value without a var. It fails to evaluate the return
    // value properly in the template.
    var isNested =
      ($scope.parentEntityData != null &&
        typeof($scope.parentEntityData) != "undefined");

    return isNested;
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