Rails.application.routes.draw do
  resources :widgets

  match '/users' => 'users#create', via: :post
  match '/users' => 'users#show', via: :get
  match '/login' => 'session#create', via: :post
  match '/logout' => 'session#destroy', via: :delete

  match '/friends' => 'friendships#show', via: :get
  match '/friends' => 'friendships#create', via: :post
  match '/friends' => 'friendships#update', via: :put
  match '/friends' => 'friendships#destroy', via: :delete
end
