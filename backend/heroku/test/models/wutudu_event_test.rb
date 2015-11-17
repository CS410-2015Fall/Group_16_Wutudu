require 'test_helper'

class WutuduEventTest < ActiveSupport::TestCase
  def setup
    @wutudu_event_fixture = wutudu_events(:wutudu_event_1)
  end

  def teardown
    @wutudu_event_fixture = nil
  end

  test 'should correctly show event details' do
    event_details = '{:name=>"Medina Cafe", :location=>{:lat=>49.2806109737591, :long=>-123.117218660062, :address=>"780 Richards Street Downtown Vancouver, BC V6B 3A4 Canada"}, :categories=>"Breakfast & Brunch, Moroccan, Middle Eastern", :rating=>{:value=>4.0, :count=>1034}, :phone_number=>"+1-604-879-3114", :yelp_url=>"http://www.yelp.com/biz/medina-cafe-vancouver"}'
    assert_equal(event_details, @wutudu_event_fixture.get_event_details)
  end

  test 'should correctly show empty string with nil event details' do
    @wutudu_event_fixture.event_details = nil
    assert_equal("", @wutudu_event_fixture.get_event_details)
  end

  test 'should correctly show accepted users info' do
    assert_equal([users(:user_2).basic_info], @wutudu_event_fixture.accepted_user_info)
  end
end
