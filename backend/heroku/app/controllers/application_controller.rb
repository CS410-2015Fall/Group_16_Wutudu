class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # TODO: WE WANT TO TURN THIS BACK ON
  respond_to :json
  protect_from_forgery with: :null_session, if: Proc.new { |c| c.request.format == 'application/json'}

  def show
  	render json: test
    # render nothing: true
  end

  private

  def test
  	latitude, longitude, yelp_id = 49.283552, -123.119506, ["nightlife", "shopping", "food"]
  	# bl = ThirdPartyAPI::GooglePlacesSearch.new(latitude, longitude, yelp_id)
  	# bl = ThirdPartyAPI::FourSquareAPI.new(latitude, longitude, yelp_id)
  	# bl = ThirdPartyAPI::YelpSearch.new(latitude, longitude, yelp_id)
  	# bl.summary
  	# bl.response
  	bl = Magic::BestLocation.new(latitude, longitude, yelp_id)
  	bl.find_best_location
  	# bl = ThirdPartyAPI::MagicAPI.new(latitude, longitude, yelp_id)
  	# bl.api.summary
  	# {
  	# 	yelp: bl.api.yelp.response,
  	# 	four: bl.api.four_square.response
  	# }
  end
end
