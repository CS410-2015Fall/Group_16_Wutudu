class PreWutuduController < ApiController
  before_action :authenticate
  before_action :client_in_group
  before_action :wutudu_in_group, except: [:create]

  def show
    message = { pre_wutudu: @pre_wutudu.show_info }
    return send_success(message)
  end

  def create
    pre_wutudu = @group.pre_wutudus.build(create_params)

    questions = Question.all.sample(10)
    return send_internal_error unless questions
    return send_internal_error if questions.empty?

    (0..9).each do |qnum|
      return send_internal_error if pre_wutudu.pre_wutudu_questions.exists?(qnum: qnum)
      pre_wutudu.pre_wutudu_questions.build(question_id: questions[qnum].id, qnum: qnum)
    end

    return send_internal_error if pre_wutudu.pre_wutudu_questions.size != 10
    return send_errors("Failed To Create PreWutudu", 400) unless pre_wutudu.save
    return send_success({pre_wutudu: pre_wutudu.show_info, message: "PreWutudu Created"})
  end

  def destroy
    @pre_wutudu.destroy
    return send_errors("Failed To Delete PreWutudu", 400) unless @pre_wutudu.destroyed?
    return send_success({message: "PreWutudu Deleted"})
  end

  private

  def create_params
    c = params.require(:pre_wutudu).permit(:event_date, :latitude, :longitude)
    [:event_date, :latitude, :longitude].each {|p| c.require(p)}
    c
  end

  def client_in_group
    @group = @user.groups.find_by_id(params[:group_id])
    return send_errors("User Not In Group", 404) unless @group
  end

  # Check if client in the group that the wutudu refers to
  def wutudu_in_group
    @pre_wutudu = @group.pre_wutudus.find_by_id(params[:id])
    return send_errors("PreWutudu Not Found In Group", 404) unless @pre_wutudu
  end
end
