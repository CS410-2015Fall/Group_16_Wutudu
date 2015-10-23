Rails.application.routes.draw do
  resources :widgets

  match '/users' => 'users#create', via: :post
  match '/users' => 'users#show', via: :get
  match '/login' => 'sessions#create', via: :post
  match '/logout' => 'sessions#destroy', via: :delete

  match '/friends' => 'friendships#show', via: :get
  match '/friends' => 'friendships#create', via: :post
  match '/friends' => 'friendships#update', via: :put
  match '/friends' => 'friendships#destroy', via: :delete

  match '/groups' => 'groups#show', via: :get
  match '/groups' => 'groups#create', via: :post

  match '/groups/:id/users' => 'group_users#show', via: :get
  match '/groups/:id/users' => 'group_users#create', via: :post
  match '/groups/:id/users' => 'group_users#update', via: :put
  match '/groups/:id/users' => 'group_users#destroy', via: :delete

  match '/groups/:group_id/prewutudu'     => 'pre_wutudu#create', via: :post
  match '/groups/:group_id/prewutudu/:id' => 'pre_wutudu#show', via: :get
  match '/groups/:group_id/prewutudu/:id' => 'pre_wutudu#destroy', via: :delete

  root  'application#show'
end
