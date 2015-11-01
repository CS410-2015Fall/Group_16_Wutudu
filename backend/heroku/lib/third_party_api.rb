require 'yelp'

module ThirdPartyAPI
  # 49.283552, -123.119506 Downtown
  SEARCH_RADIUS = 2000

  class API
    attr_reader :lat, :long, :response, :summary
    def initialize(lat, long, categories)
      @lat = lat
      @long = long
      @categories = categories
    end
  end

  class YelpSearch < API

    # Params:
    # lat: latitude (Float)
    # long: longitude (Float)
    # cats: categories (Array)
    #
    # Example:
    # ys = ThirdPartyAPI::YelpSearch.new(49.283552, -123.119506, ["food", "nightlife", "shopping"])
    def initialize(lat, long, categories)
      super(lat, long, categories)
      @client = Yelp.client
      search_by_categories
      query_summary
    end

    # Gives the formatted output of specified bid.
    # Params:
    # bid: business id (String)
    # *cat: optional category (String)
    #   If specified, then return from existing query
    #   Else fire a new query to find business info of bid
    #
    # Example:
    # ys.business_summary("moms-grilled-cheese-truck-vancouver", "food")
    # or
    # ys.business_summary("moms-grilled-cheese-truck-vancouver")
    def business_summary(bid, *cat)
      if cat.empty?
        b = search_by_bid(bid)
      else
        b_index = @response[cat.first].businesses.find_index{|b| b.id == bid}
        b = @response[cat.first].businesses[b_index]
      end
      {
        name: b.name,
        location: {
          lat: b.location.coordinate.latitude,
          long: b.location.coordinate.longitude,
          address: b.location.display_address.join(' ')
        },
        categories: b.categories.collect{|c| c[0]}.join(', '),
        rating: {
          value: b.rating,
          count: b.review_count,
        },
        phone_number: b.display_phone,
        yelp_url: "http://www.yelp.com/biz/#{b.id}"
      }
    end

    private

    def search_by_categories
      @response = {}
      @categories.each do |cat|
        coordinates = { latitude: @lat, longitude: @long }
        params = {
                   category_filter: cat,
                   radius_filter: SEARCH_RADIUS, #Determine the size of area search
                   sort: 1, #0=BestMatched 1=Distance 2=HighestRating
                   limit: 20
                 }
        @response[cat] = @client.search_by_coordinates(coordinates, params)
      end
    end

    def search_by_bid(bid)
      @client.business(bid).business
    end

    def query_summary
      @summary = {}
      @categories.each do |cat|
        @summary[cat] = {
                          id: [],
                          distance: [],
                          rating: [],
                          review_count: [],
                          is_closed: []
                        }
        @response[cat].businesses.each do |b|
          @summary[cat][:id].push(b.id)
          @summary[cat][:distance].push(b.distance)
          @summary[cat][:rating].push(b.rating)
          @summary[cat][:review_count].push(b.review_count)
          @summary[cat][:is_closed].push(b.is_closed)
        end
      end
    end
  end

  # Google Place API for searching with categories. WIP
  # google = ThirdPartyAPI::GooglePlacesSearch.new(49.283552, -123.119506, ["food", "nightlife", "shopping"])
  # class GooglePlacesSearch < API
  #   ListToExclude = [
  #                     'lodging', 'church', 'place_of_worship', \
  #                     'shopping_mall', 'university', 'health', \
  #                     'bank', 'insurance_agency', 'finance', \
  #                     'department_store', 'stadium', 'real_estate_agency'
  #                   ]

  #   def initialize(lat, long, categories)
  #     super(lat, long, categories)
  #     @client = GooglePlaces::Client.new(ENV['GOOGLE-API-KEY'])
  #     search_by_categories
  #   end

  #   private

  #   def search_by_categories
  #     # 49.283552, -123.119506 Downtown
  #     # Add multipage: true if want more result
  #     @response = {}
  #     @categories.each do |cat|
  #       @response[cat] = @client.spots(@lat, @long, radius: SEARCH_RADIUS, \
  #                                      exclude: ListToExclude, types: cat)
  #     end
  #   end

  # end

  # class FourSquareAPI < API
  #   attr_reader :client, :query_response
  #   @client = nil
  # end
end
