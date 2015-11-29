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
        search_by_bid(bid)
      else
        b_index = @response[cat.first].businesses.find_index{|b| b.id == bid}
        @response[cat.first].businesses[b_index]
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

    # search list of venue using name, lat, lon
    # and grab the top of result(most relevant)
    def business_summary(lat, lon, bname)
      ret =  {
        hours: nil,
        formatted_hours: nil
      }
      return ret if @client.nil?

      radius = 100 # improve result to get the correct one
      latlng = lat.to_s + ',' + lon.to_s
      response = @client.search_venues(ll: latlng, radius: radius,  query: bname)
      if response.venues.length == 0
        response = @client.search_venues(ll: latlng,  query: bname)
      end

      if response.venues.length > 0
        hours = @client.venue_hours(response.venues[0].id)
        sum = @client.venue(response.venues[0].id)

        ret = {
          hours: hours.hours,
          formatted_hours: sum.hours
        } unless hours.nil? || sum.nil?
      end
      ret
    end
  end

  class MagicAPI
    attr_reader :summary, :yelp, :four_square
    def initialize(lat, long, cats)
      initAPIs(lat, long, cats)
      query_summary
    end

    def business_summary(b)
      event_date = b[:event_date]
      yelp_sum = @yelp.business_summary(b[:id]).dup
      lat = yelp_sum.location.coordinate.latitude
      lon = yelp_sum.location.coordinate.longitude
      four_square_sum = @four_square.business_summary(lat, lon, b[:name]).dup

      sum = {
        # event_date: event_date,
        name: yelp_sum.name,
        img_url: yelp_sum.image_url,
        distance: yelp_sum.distance,
        location: {
          lat: yelp_sum.location.coordinate.latitude,
          long: yelp_sum.location.coordinate.longitude,
          address: yelp_sum.location.display_address.join(' '),
        },
        categories: yelp_sum.categories.collect{|c| c[0]}.join(', '),
        rating: {
          value: yelp_sum.rating,
          count: yelp_sum.review_count
        },
        phone_number: yelp_sum.display_phone,
        yelp_url: yelp_sum.mobile_url,
        opening_hours: four_square_sum[:hours] &&
            four_square_sum[:formatted_hours] &&
          show_opening_hours(four_square_sum[:hours].timeframes,
            four_square_sum[:formatted_hours].timeframes,
             event_date)
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

    # render the opening hours for event date
    def show_opening_hours(times, formatted_times, event_date)
      result = 'Not Open Today'
      event_day =  transformToFourSquareDay(event_date.in_time_zone.wday)
      times.each_with_index do |time, index|
        unless time.days.index(event_day).nil?
          result = formatted_times[index].open[0].renderedTime
        end
      end
      result
    end

    def transformToFourSquareDay(day)
      if day == 0
        7
      else
        day
      end
    end

  end
end
