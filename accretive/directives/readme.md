# SAN Directive Documentation #


### SAN Breadcrumbs ###
-----------------------

The san-breadcrumbs is an easy way to include breadcrumbs onto each page. It automatically pulls the name of the breadcrumbs
from the route name. The transclude allows the addition of any element at the end of the the list of breadcrumbs but within
the ordered list. 

* __HTML usage__: 
  ```
  <san-breadcrumbs>
    ...
  </san-breadcrumbs>
  ```

* __Attributes__: None

* __Transclusion__: Yes

* __Directive template__:
  ```
  <ol class="breadcrumb">
    <li ng-repeat="crumb in crumbs"><a href="{{ crumb.href }}">{{ crumb.name }}</a></li>
    <ng-transclude></ng-transclude>
  </ol>
  ```

* __Example usage__:
  ```
  <san-breadcrumbs>
    <li class="noncrumb pull-right"><a class="btn btn-xs btn-primary" ui-sref="< state reference transistion >"> Button Name </a></li>
  </san-breadcrumbs>
  ```



### SAN Confirm ###
-----------------------

SAN confirm combines the functions of a confirmation for the deletion of an item on the SAN front end. The css, buttons, and
functionality are all used to inform the user what they are deleting and gives an extra layer of protection for the deletion of items.
The text attributes label the buttons upon calling the directive. Not using a confirm text defaults to just confirm and cancel

* __HTML usage__: 
```
<san-confirm
  active=""
  confirm=""
  confirm-text=""
  cancel=""
  cancel-text="">
  ...
</san-confirm>
```

* __Attributes__: 
    * active       : required / 2 way bound
    * confirm      : required
    * confirm-text : required / expression
    * cancel       : required
    * cancel-text  : required / expression

* __Transclusion__: Yes

* __Directive Template__:
  ```
  <div ng-show="active" class="alert-margin">
    <div class="alert alert-danger">
      <ng-transclude></ng-transclude>
      <button ng-click="active=false; confirm()" class="btn btn-danger">{{confirmText || 'Confirm'}}</button>
      <button ng-click="active=false; cancel()" class="btn btn-default">{{cancelText || 'Cancel'}}</button>
    </div>
  </div>
  ```

* __Example Usage__:
  ```
  <san-confirm
    active="variable"
    cancel="!variable"
    confirm="deleteFunction(foo.id)"
    confirm-text="Delete This Thing {{foo.name}}"
    cancel-text="Cancel Delete for {{foo.name}}">
    <p>Are you sure you wish to delete this thing &quot;{{foo.name}}&quot;?</p>
  </san-confirm>
  ```



### SAN Crud Buttons ###
-----------------------

SAN crud buttons combine 4 buttons into one directive for the functionality of of switching between Edit/Delete and Save/Cancel. All
attributes on this directive are 1 way bound.

* __HTML usage__:
  ```
  <san-crud-buttons
    edit=""
    delete=""
    save=""
    cancel="">
  </san-crud-buttons>
  ```

* __Attributes__: 
    * edit    : required
    * delete  : required
    * save    : required
    * cancel  : required

* __Transclusion__: None

* __Directive Template__:
  ```
  <button ng-show="!toggleEdit" class="btn btn-xs btn-info" ng-click="toggleEdit=true; edit()">Edit</button>
  <button ng-show="!toggleEdit" class="btn btn-xs btn-danger" ng-click="delete()">Delete</button>
  <button ng-show="toggleEdit" class="btn btn-xs btn-info" ng-click="toggleEdit=false; save()">Save</button>
  <button ng-show="toggleEdit" class="btn btn-xs btn-default" ng-click="toggleEdit=false; cancel()">Cancel</button>
  ```

* __Example Usage__:
  ```
  <san-crud-buttons
    edit="editFunc()"
    delete="confirmDeleteVariable=true"
    save="saveFunc(foo)"
    cancel="cancelFunc()">
  </san-crud-buttons>
  ```



### SAN Field Group ###
-----------------------

The field group directive unifies the styling and functionality for all of our information display and creation templates for SAN. The
field group container piece beings the description list. Inside the element, san-field sets up each individual line with an input and
allows for date, number, and checkbox to be entered as a type. Label is the display label for the description title. Model is used only
in the above cases and is used to act like ng-model. Required atrributes allows to set the field to be required or not and takes a
boolean (defaults to false). Lastly, the edit-var is what variable the page uses to flip on.
San field also have a transclude to allow the usage of the select element. This causes the model to specifcally be used as a display piece
and the ng-model should be used on the select to bind to the correct model.

* __HTML usage__: 
  ```
  <san-field-group>
    <san-field
      label=""
      model=""
      edit-var=""
      type=""
      required="">
    </san-field>
  </san-field-group>
  ```

* __Attributes__:
    * label    : required
    * model    : required / 2 way bound
    * edit-var : 2 way bound
    * type     : 
    * required : boolean

* __Transclusion__: Yes

* __Directive Template__:

    * SAN Field Group:
        ```
        <dl class="dl-horizontal field-group">
          <ng-transclude></ng-transclude>
        </dl>
        ```

    * SAN Field:
        ```
        <dt><label>{{label}}:</label></dt>
          <dd ng-show="!editVar" ng-switch="type">
          <p>
            <span ng-switch-when="checkbox">{{model ? 'Yes' : 'No'}}</span>
            <span ng-switch-when="date">{{model | date: 'short'}}</span>
            <span ng-switch-default>{{model}}</span>
          </p>
        </dd>
        <dd ng-show="editVar">
          <div ng-show="type" class="field">
            <input ng-model="model" type="{{type}}" class="form-control" style="margin-top: 0;" ng-required="required">
          </div>
          <ng-transclude ng-show="!type"></ng-transclude>
        </dd>
        ```

* __Example Usage__:
  ```
  <san-field-group>
    <san-field label="Label One" model="foo.name"></san-field>   // not editable
    <san-field label="Dropdown" model="foo.displayName" edit-var="editFoo">
      <select ng-model="foo.item" ng-options="item as item.name for items in masterArray" class="form-control" required>
        <option value="">{{foo.displayName}}</option>   // manually makes an entry at the beginning of the options
      </select>
    </san-field>
    <san-field label="Date" model="foo.date" type="date" edit-var="editFoo"></san-field>
    <san-field label="Number" model="foo.number" edit-var="'true'" type="number" required="true"></san-field>  // edit-var as true makes edit mode always on
    <san-field label="Checkbox" model="foo.checkbox" edit-var="editFoo" type="checkbox" required="true"></san-field>
  </san-field-group>
  ```



### SAN Filter ###
-----------------------

SAN filter is used in conjunction with the SAN sidebar. It is simply a search bar that filters through the list of items from SAN sidebar.
It also has an option to show disabled items passed to the SAN side bar.

* __HTML usage__: 
  ```
  <san-filter></san-filter>
  ```

* __Attributes__:
    * filter : required / 2 way bound

* __Transclusion__: None

* __Directive Template__:
  ```
  <div class="form-group">
      <div class="input-group">
        <input type="text" class="form-control" ng-model="searchFilter" placeholder="Search">
        <span class="input-group-btn">
          <button class="btn btn-default" type="button" ng-click="optionsVisible=!optionsVisible">
              <span class="glyphicon glyphicon-cog"></span>
          </button>
        </span>
      </div>
  </div>
  <div ng-show="optionsVisible" class="list-group">
      <div class="list-group-item">
        <div class="checkbox">
          <label>
            <input ng-model="settings.showDisabled" type="checkbox"> Show Disabled
          </label>
        </div>
      </div>
  </div>
  ```

* __Example Usage__:
  ```
  <san-filter filter="searchFilter">
  ```



### SAN Sidebar ###
-----------------------

SAN sidebar controls the list of items for an inventory. It combines the look and functionality of all the inventory main pages.
SAN sidebar takes a data array and the destination url for said items. The side bar also automatically includes pagination for
the data given to it.

* __HTML usage__:
  ```
  <san-sidebar
    data=""
    desturl="">
  </san-sidebar>
  ```

* __Attributes__:
    * data : required / 2 way bound / watch collection
    * desturl : required / expression

* __Transclusion__: None

* __Directive Template__:
  ```
  <div class="form-group">
    <san-filter filter="searchFilter">
  </div>
  <div class="list-group">
    <a ng-repeat="item in data | filter:searchFilter | filter: onPage" ng-class="{ active: isActive(item.id) }" href="{{desturl({id:item.id})}}" class="list-group-item">{{item.name}}</a>
  </div>
  <nav class="text-center">
    <pagination
        total-items="totalItems"
        items-per-page="itemsPerPage"
        ng-model="currentPage"
        ng-change="pageChanged()"
        previous-text="&lsaquo;"
        next-text="&rsaquo;"
        first-text="&laquo;"
        last-text="&raquo;"
        max-size="maxSize"
        class="pagination-sm smMargin"
        boundary-links="true">
    </pagination>
  </nav>
  ```

* __Example Usage__:
  ```
  <san-sidebar
    data="foo.array"
    desturl="$state.href('<state name>',{ id:id })">
  </san-sidebar>
  ```