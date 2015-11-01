module Magic
  DATA_VARIABLES = [:distance, :rating, :review_count]
  WEIGHTS = {distance: 0.40, rating: 0.4, review_count: 0.2}

  class BestLocation
    attr_reader :location, :scores, :data, :categories
    # Params:
    # lat: latitude (Float)
    # long: longitude (Float)
    # cats: categories with decreasing rank (Array)
    #
    # Example:
    # bl = Magic::BestLocation.new(49.283552, -123.119506, ["food", "nightlife", "shopping"])
    def initialize(lat, long, cats)
      @api = ThirdPartyAPI::YelpSearch.new(lat, long, cats)
      @categories = cats
      @sums = {}
      @avgs = {}
      @scores = []
    end

    # Outputs (and saves to @location) the formatted yelp result with the maximum score
    # Params:
    # cat: optional category (String)
    #
    # Example:
    # result = bl.find_best_location #Will only produce best location for "food" by default
    # result = bl.find_best_location("nightlife") #Will produce best location for nightlife
    # OR
    # Call bl.location since it stores the result
    def find_best_location(*cat)
      c = (cat.empty? ? @categories[0] : cat[0])
      if @categories.include?(c)
        transform_data(c)
        id = @data[:id][@scores.index(@scores.max)]
        @location = @api.business_summary(id)
      else
        @location = nil
      end
      @location
    end

    private

    # Elimnate permanently closed locations
    def eliminate_closed
      @is_closed = @data[:is_closed]
      @data.except!(:is_closed)
      closed_indexes = @is_closed.each_index.select{|i| @is_closed[i]}
      closed_indexes.each do |ci|
        (DATA_VARIABLES | [:id]).each{|v| @data[v].delete_at(ci)}
      end
    end

    # Normalize each sets of data with respect to their means
    def normalize_data
      DATA_VARIABLES.each do |v|
        @sums[v] = @data[v].inject(:+)
        @avgs[v] = @sums[v] / @data[v].length.to_f
        @data[v] = @data[v].map{|d| d / @avgs[v]}
      end
    end

    # Calculate score based on weights
    def calculate_score
      @data[:id].each_index do |i|
        @scores[i] = 0
        DATA_VARIABLES.each do |v|
          @scores[i] += @data[v][i] * WEIGHTS[v]
        end
      end
    end

    def transform_data(cat)
      @data = @api.summary[cat].dup
      unless @data.empty?
        eliminate_closed
        normalize_data
        calculate_score
      end
    end
  end
end