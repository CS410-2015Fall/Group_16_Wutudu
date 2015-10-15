Rails.application.routes.draw do
  resources :widgets

  match '/users' => 'users#create', via: :post
  match '/users' => 'users#show', via: :get
  match '/login' => 'users#login', via: :post
end
