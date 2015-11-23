module ThirdPartyAPI
  # 49.283552, -123.119506 Downtown
  SEARCH_RADIUS = 2000
  APIS = {yelp: 0, four_square: 1}

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
      @client.business(URI.escape(bid.encode('utf-8'))).business
    end

    def query_summary
      @summary = {}
      @categories.each do |cat|
        @summary[cat] = {
                          id: [],
                          distance: [],
                          rating: [],
                          review_count: [],
                          is_closed: [],
                          name: []
                        }
        @response[cat].businesses.each do |b|
          @summary[cat][:id].push(b.id)
          @summary[cat][:distance].push(b.distance)
          @summary[cat][:rating].push(b.rating)
          @summary[cat][:review_count].push(b.review_count)
          @summary[cat][:is_closed].push(b.is_closed)
          @summary[cat][:name].push(b.name)
        end
      end
    end
  end

  # only used for supplement info
  # opening hours
  class FourSquareAPI < API
    attr_reader :client, :query_response

    #https://developer.foursquare.com/overview/versioning

    def initialize(lat, long, categories)
      super(lat, long, categories)
      @client = Foursquare2::Client.new(client_id: ENV['FOUR-SQUARE-CLIENT-ID'], \
                                        client_secret: ENV['FOUR-SQUARE-CLIENT-SECRET'],
                                        api_version: ENV['FOUR-SQUARE-API-VERSION'])
    end

    def business_summary(bname)
      b = search_by_name(bname)
    end

    private

    # search list of venue using name,
    # and grab the top of result(most relevant)
    def search_by_name(bname)
      latlng = @lat.to_s + ',' + @long.to_s
      response = @client.search_venues(ll: latlng, query: bname)
      @client.venue(response.venues[0].id)
    end

  end

  class MagicAPI
    attr_reader :summary, :yelp, :four_square
    def initialize(lat, long, cats)
      initAPIs(lat, long, cats)
      query_summary
    end

    def business_summary(b)
      yelp_sum = @yelp.business_summary(b[:id]).dup
      four_square_sum = @four_square.business_summary(b[:name]).dup
      sum = {
        name: yelp_sum.name,
        img_url: yelp_sum.image_url,
        distance: yelp_sum.distance,
        location: {
          lat: yelp_sum.location.coordinate.latitude,
          long: yelp_sum.location.coordinate.longitude,
          address: four_square_sum.location.formattedAddress \
          ||  yelp_sum.location.display_address.join(' ')
        },
        categories: yelp_sum.categories.collect{|c| c[0]}.join(', '),
        rating: {
          value: yelp_sum.rating,
          count: yelp_sum.review_count
        },
        phone_number: yelp_sum.display_phone,
        yelp_url: yelp_sum.mobile_url,
        four_square_url: four_square_sum.canonicalUrl,
        user_checkins: "#{four_square_sum.stats.checkinsCount} checkins  (#{four_square_sum.stats.usersCount} users)",
        users_here_now: four_square_sum.hereNow.count,
        hours_status: four_square_sum.hours && four_square_sum.hours.status,
        is_open: four_square_sum.hours && four_square_sum.hours.isOpen,
        opening_hours: four_square_sum.hours && four_square_sum.hours.timeframes.map{|time|
            "#{time.days} : #{time.open[0].renderedTime}"
        }
      }
      sum.compact
    end

    private

    def initAPIs(lat, long, cats)
      @yelp = ThirdPartyAPI::YelpSearch.new(lat, long, cats)
      @four_square = ThirdPartyAPI::FourSquareAPI.new(lat, long, cats)
    end

    def query_summary
      @summary = @yelp.summary
    end

  end
end
