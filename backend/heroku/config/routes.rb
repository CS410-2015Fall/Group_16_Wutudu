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

  match '/groups/:gid' => 'group_details#show', via: :get

  match '/groups/:gid/users' => 'group_users#create', via: :post
  match '/groups/:gid/users' => 'group_users#update', via: :put
  match '/groups/:gid/users' => 'group_users#destroy', via: :delete

  match '/groups/:gid/pre_wutudu'     => 'pre_wutudu#create', via: :post
  match '/groups/:gid/pre_wutudu/:id' => 'pre_wutudu#show', via: :get
  match '/groups/:gid/pre_wutudu/:id' => 'pre_wutudu#destroy', via: :delete

  match '/groups/:gid/pre_wutudu/:id/answers' => 'user_answer#create', via: :post
  match '/groups/:gid/pre_wutudu/:id/answers' => 'user_answer#show', via: :get

  root  'application#show'
end
