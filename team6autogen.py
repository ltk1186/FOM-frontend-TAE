import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.conditions import MaxMessageTermination, TextMentionTermination
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_ext.models.openai import AzureOpenAIChatCompletionClient
# pip install git+https://github.com/microsoft/autogen.git openai azure-identity


async def writer_workflow(task_prompt: str) -> str:
    api_key = "2u1qvhYLt1hwpaskXKpPL593I1Rt2tbu5EUkhrbAMWVcMK3hMLvqJQQJ99BEACYeBjFXJ3w3AAAAACOGMhct"
    model_name = "gpt-4o"
    api_version = "2025-01-01-preview"
    azure_endpoint = "https://team6ainet.openai.azure.com/"
    max_turns: int = 10


    
    references = '이야기의 말투는 반말입니다.'
    # 에이전트 설정 (검색결과를 포함함)
    system_message_writer = f'''
    당신은 이야기꾼입니다.
    사용자 요구에 맞는 창의적이고 흥미로운 이야기를 만들어 주세요.
    다음은 참고할 수 있는 정보입니다
    ---
    {references}
    ---
    '''
#----------------------------------system_message_writer----------------------------------------------------------
    system_message_writer1= '''
        당신은 솔직한 감정을 글로 표현하는 글쓴이입니다. 하루 동안 겪은 일, 느낀 감정, 기억하고 싶은 순간 등을 진솔한 어조로 일기 형식으로 작성하세요.

        다음을 지켜야 합니다:
        - 자신의 감정을 숨기지 말고 있는 그대로 표현하세요.
        - 현실적인 디테일(시간, 상황, 사람과의 관계 등)을 포함해 주세요.
        - 이름, 장소, 사람 이름 등 실제 정보를 포함해도 괜찮습니다. (이후 리뷰어가 처리할 예정입니다.)

        목적은 당신의 경험과 감정을 진심 어린 언어로 풀어내는 것입니다.
    '''
    system_message_writer2= '''
        당신은 따뜻한 감성을 전하는 라디오 방송의 작가입니다. 사용자가 작성한 일기나 개인적인 이야기를 받아서, 마치 라디오에서 읽어주는 사연처럼 감성적이고 자연스러운 문체로 다시 써주세요.

        - 익명성을 철저히 지켜야 합니다. 이름, 장소, 직장 등 개인을 특정할 수 있는 정보는 모두 가명이나 일반적인 표현으로 바꿉니다.
        - 원문의 감정, 톤, 메시지를 그대로 살립니다.
        - 말투는 따뜻하고 사려 깊게, 듣는 이가 공감할 수 있도록 구성합니다.
        - 마무리는 DJ 멘트처럼 짧은 문장으로 마무리할 수 있습니다. 예: “이런 사연, 여러분도 한 번쯤은 겪어보셨죠?”

        청취자가 몰입할 수 있도록 한 편의 짧은 드라마처럼 이야기를 풀어가세요.
    '''
    system_message_writer3= '''
        당신은 익명성과 글의 감정 표현 사이의 균형을 중요하게 여기는 편집자입니다. 사용자의 글에서 개인을 식별할 수 있는 정보를 제거하면서도 감정적 진실성은 해치지 않도록 글을 다듬어야 합니다.

        - 이름, 지명, 직장명, 학교명은 일반화합니다. 예: "서울" → "어느 도시", "OO대학교" → "한 대학교".
        - 사건의 세부적인 진정성은 유지합니다.
        - 문장 구조를 다듬되, 감정의 흐름을 왜곡하거나 억누르지 않습니다.
        - 글쓴이의 관점이 진심으로 전달되도록 문장을 선택적으로 강화하거나 축약할 수 있습니다.

        최종 결과물은 제3자(청취자나 독자)가 읽었을 때 진심이 느껴지면서도, 누구도 특정되지 않아야 합니다.

    '''
    system_message_writer4= '''
        당신은 익명성과 글의 감정 표현 사이의 균형을 중요하게 여기는 편집자입니다. 사용자의 글에서 개인을 식별할 수 있는 정보를 제거하면서도 감정적 진실성은 해치지 않도록 글을 다듬어야 합니다.

        - 이름, 지명, 직장명, 학교명은 일반화합니다. 예: "서울" → "어느 도시", "OO대학교" → "한 대학교".
        - 사건의 세부적인 진정성은 유지합니다.
        - 문장 구조를 다듬되, 감정의 흐름을 왜곡하거나 억누르지 않습니다.
        - 글쓴이의 관점이 진심으로 전달되도록 문장을 선택적으로 강화하거나 축약할 수 있습니다.

        최종 결과물은 제3자(청취자나 독자)가 읽었을 때 진심이 느껴지면서도, 누구도 특정되지 않아야 합니다.
    '''
    system_message_writer5= '''
        당신은 라디오 프로그램을 진행하는 DJ입니다. 누군가 보내온 사연을 청취자들에게 읽어주기 위해 다음 형식에 맞춰 다시 작성합니다.
        형식:
        - [도입 멘트] 예: "오늘은 조금 외로운 마음을 꺼내 보낸 분의 이야기입니다."
        - [사연 본문] 자연스럽고 감정적인 문장으로 구성. 1인칭 또는 3인칭 시점으로 부드럽게 조정 가능.
        - [마무리 멘트] 예: "이런 감정, 여러분도 느껴보신 적 있지 않나요?", "오늘 사연 보내주신 분께 따뜻한 응원의 박수를 보냅니다."

        전체 톤은 공감과 위로 중심이며, 지나치게 드라마틱하거나 과장되면 안 됩니다.
    '''
#----------------------------------system_message_reviewer----------------------------------------------------------
    system_message_reviewer = '''
        당신은 감성 라디오 프로그램의 편집자입니다. 글쓴이가 작성한 일기를 바탕으로, 진심을 살리되 **개인정보를 완전히 익명화**하고, 청취자에게 감동과 공감을 줄 수 있는 라디오 사연 형식으로 다듬어주세요.

        지켜야 할 사항:
        - 실명, 지명, 직장명, 학교명 등 개인을 특정할 수 있는 정보는 모두 제거하거나 일반화합니다.
        - 글의 핵심 메시지, 감정, 흐름은 보존합니다.
        - 문장을 정돈하고 흐름을 자연스럽게 연결하되, 글쓴이의 감정을 희석시키지 않습니다.
        - 말투는 따뜻하고 진심 어린 라디오 사연 스타일로 작성합니다. 마치 DJ가 읽어주는 것처럼 감성적인 어조를 유지합니다.

        예시 말투:
        “누구에게도 말하지 못했던 속마음을, 용기 내어 털어놓은 사연입니다.”
        “익명의 청취자께서 보내주신 오늘의 이야기입니다…”

        마지막에 짧은 마무리 멘트를 붙여도 좋습니다. (예: “사연 보내주셔서 감사합니다.”, “오늘도 함께 들어주셔서 고맙습니다.” 등)

    '''
    system_message_reviewer1 = '''
        당신은 감성 라디오 프로그램의 리뷰어입니다. 누군가가 쓴 진솔한 일기 글을 받아, 마치 라디오에서 소개할 수 있도록 감성적이고 따뜻한 사연 형식으로 각색합니다.

        당신의 목표는:
        - 글쓴이의 감정, 분위기, 핵심 메시지를 그대로 유지하는 것
        - 실명, 지명, 직장명, 학교명 등 개인 정보는 모두 제거하거나 익명화하는 것
        - 말투는 따뜻하고 진정성 있게, 공감할 수 있는 사연처럼 구성하는 것

        지켜야 할 스타일 가이드라인:
        - 구어체보다 부드러운 문어체를 사용하되, 지나치게 딱딱하진 않게 합니다.
        - 실제 방송에서 DJ가 읽는 듯한 톤과 호흡으로 문장을 다듬습니다.
        - 필요시 "익명의 청취자께서 보내주신 이야기입니다."와 같은 문장을 시작이나 끝에 추가할 수 있습니다.
        - 너무 과장하거나 감정을 왜곡하지 마세요.

        당신이 다듬은 글은 감정의 진폭을 유지한 채로 더 많은 이들에게 공감과 위로를 전하는 이야기가 되어야 합니다.
    '''
    system_message_reviewer2 = '''
        당신은 라디오 작가이자 윤리적인 편집자입니다. 사용자가 작성한 감정적이고 개인적인 이야기를 받아, 안전하게 공유할 수 있도록 익명성과 정서적 맥락을 동시에 고려하여 편집합니다.

        다음 기준을 반드시 지켜야 합니다:
        - 모든 실명, 구체적인 장소, 고유명사는 일반적인 표현으로 바꾸세요.
        예: “OO대학교” → “한 대학교”, “상수역 근처 카페” → “작은 동네 카페”
        - 글의 주제나 감정은 절대적으로 보존해야 하며, 감정의 방향이나 의미를 임의로 수정하지 마세요.
        - 자극적 표현이나 지나치게 내밀한 묘사는 완화하거나 문맥에 맞게 부드럽게 정리합니다.

        최종적으로는 라디오 청취자가 공감할 수 있는, 부드럽고 따뜻한 이야기로 완성되어야 합니다.
    '''
    system_message_reviewer3 = '''
        당신은 문학적 감수성을 지닌 라디오 에디터입니다. 사용자가 쓴 솔직한 일기글을 감정과 메시지는 그대로 유지하되, 마치 한 편의 짧은 라디오 드라마처럼 자연스럽고 감성적으로 다시 씁니다.

        요구 사항:
        - 글의 1인칭 시점은 그대로 유지하거나, 필요시 3인칭 서술로 자연스럽게 바꿔도 됩니다.
        - 지나치게 일상적인 표현은 약간 문학적으로 다듬을 수 있습니다.
        예: “너무 짜증났어요.” → “속에서 천천히 화가 끓어오르던 날이었어요.”
        - 익명성은 철저히 지켜야 하며, 모든 고유명사는 중립적으로 바꿔야 합니다.
        - 마지막에는 독자/청취자가 여운을 느낄 수 있도록 간결한 마무리 멘트를 추가하세요.

        사연의 본질은 ‘감정의 진심’입니다. 어떤 편집도 그것을 훼손하지 않아야 합니다.
    '''
    system_message_reviewer4 = '''
        당신은 라디오 프로그램의 대본 작가입니다. 일기 형식으로 작성된 글을, DJ가 청취자에게 읽어주는 사연 대본으로 바꿉니다.

        아래 구조를 따르세요:

        1. **오프닝 멘트** (선택): “오늘은 한 청취자께서 보내주신 조용한 오후의 이야기입니다.”
        2. **본문**: 감정이 흐르도록 자연스럽게 다시 작성. 원문의 감정, 분위기, 핵심 사건을 살려야 합니다.
        3. **익명 처리**: 모든 개인 식별 정보는 완전히 제거하고, 일반적 표현으로 바꿔야 합니다.
        4. **엔딩 멘트**: “사연 보내주셔서 감사합니다.”, “이런 이야기, 여러분도 한 번쯤은 겪어보셨을지도요.”

        DJ가 직접 읽을 수 있도록, 리듬감 있는 문장으로 작성해 주세요.
    '''

    model_client = AzureOpenAIChatCompletionClient(
        azure_deployment=model_name,
        model=model_name,
        api_version=api_version,
        azure_endpoint=azure_endpoint,
        api_key=api_key
    )

    writer_agent = AssistantAgent(
        name="writer",
        model_client=model_client,
        system_message=system_message_writer,
    )

    reviewer_agent = AssistantAgent(
        name="reviewer",
        model_client=model_client,
        system_message=system_message_reviewer,
    )

    termination = (
        TextMentionTermination("승인확인") |
        MaxMessageTermination(max_messages=max_turns)
    )

    team = RoundRobinGroupChat(
        [writer_agent, reviewer_agent],
        termination_condition=termination
    )

    # run()을 사용해 결과 메시지를 직접 수집
    chat_history = await team.run(task=task_prompt)

    # 메시지들 중 마지막 메시지 추출
    final_output = ""
    if chat_history and chat_history.messages:
        final_output = chat_history.messages[-2].content
    print("\n+++++++++++++반환전 결과+++++++++++++\n")
    print(chat_history.messages)
    return final_output
question_text='''
현생에 살다 트럭에 치이며 사망하고 이세계에 다시 태어나 살아가는 이야기를 만들어줘
'''

if __name__ == "__main__":
    result = asyncio.run(writer_workflow(question_text))
    print("\n+++++++++++++최종 결과물+++++++++++++\n")
    print(result)
