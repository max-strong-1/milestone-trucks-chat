# Robert System Prompt - Changes Summary

## Overview
Rebuilt Robert's system prompt from scratch using ElevenLabs best practices for production-grade conversational AI.

---

## Key Improvements

### 1. **Clean Section Structure** ✅
**Before:** Single dense paragraph mixing personality, tools, and instructions
**After:** Clear markdown sections with headings:
- `# Personality`
- `# Environment`
- `# Tone`
- `# Goal`
- `# Guardrails`
- `# Tools`
- `# Character normalization`
- `# Tool error handling`
- `# Workflow examples`

**Why:** Models are tuned to pay attention to section headings. Clear separation prevents instruction bleed.

---

### 2. **Corrected Tool Count**
**Before:** "You have twelve tools"
**After:** "You have 9 tools split between webhooks (server-side data) and client tools (browser actions)"

**Breakdown:**
- 4 Webhook Tools: `check_service_area`, `get_materials_by_zip`, `get_material_details`, `calculate_quantity`
- 5 Client Tools: `create_or_update_cart`, `navigate_to`, `prefill_checkout_form`, `get_session_state`, `update_session_state`

---

### 3. **Fixed Tool Architecture**
**Before:** Mixed up which tools are webhooks vs client tools
**After:** Correct categorization with clear explanations

**Corrections:**
- ❌ OLD: `add_to_cart` webhook tool (doesn't exist)
- ✅ NEW: `create_or_update_cart` client tool (correct)

- ❌ OLD: `calculate_quantity` client tool
- ✅ NEW: `calculate_quantity` webhook tool (correct)

- ❌ OLD: `prefill_checkout_form` webhook tool
- ✅ NEW: `prefill_checkout_form` client tool (correct)

---

### 4. **Added Missing Critical Tools**
**Before:** `check_service_area` not documented
**After:** Full documentation with usage instructions

This is the FIRST tool Robert should call after getting ZIP code.

---

### 5. **Detailed Tool Usage Instructions**
Each tool now includes:
- **When to use:** Trigger conditions
- **Parameters:** Exact format with data types
- **Usage:** Step-by-step calling instructions
- **Returns:** What data comes back
- **Error handling:** What to do if tool fails

**Example:**
```markdown
### `check_service_area`

**When to use:** As soon as the customer provides their ZIP code

**Parameters:**
- `tool_name` (constant): "check_service_area"
- `zip_code` (required): 5-digit ZIP code in written format

**Usage:**
1. Listen for ZIP code in spoken format: "four three five six zero"
2. Convert to written format: "43560"
3. Call this tool with the written ZIP code

**Returns:** Confirmation if ZIP is in the 7,802 ZIP service area (OH, IN, PA, WV, KY, MI)

**Error handling:**
If tool fails, acknowledge: "I'm having trouble checking that ZIP right now. Let me try again."
```

---

### 6. **Character Normalization Section**
**NEW:** Dedicated section teaching Robert how to convert spoken input to written format

**Critical for:**
- ZIP codes: "four three five six zero" → "43560"
- Emails: "john dot smith at gmail dot com" → "john.smith@gmail.com"
- Phone: "five five five one two three four five six seven" → "5551234567"

**Why:** Voice agents often misinterpret structured data. Separating spoken vs written formats ensures accuracy.

---

### 7. **Material ID Reference Table**
**NEW:** Complete mapping of material names to product IDs (101-114)

Robert needs this to call `get_material_details` correctly:
- "#304 Limestone Base" = 101
- "#57 Limestone/Gravel" = 102
- etc.

---

### 8. **Explicit Error Handling**
**Before:** No error handling instructions
**After:** Error handling for EVERY tool

**Pattern:**
1. Acknowledge the issue
2. Retry once if temporary
3. Escalate or inform if persistent
4. Never guess or make up data

---

### 9. **Workflow Examples**
**NEW:** Two complete conversation flows showing:
- When to call each tool
- How to use tool results
- Natural conversation patterns

**Why:** LLMs follow examples more reliably than abstract instructions.

---

### 10. **Concise Instructions**
**Before:** Long rambling sentences
**After:** Short, action-based statements

**Example:**
❌ OLD: "When you're talking to customers, you should try to be really friendly and approachable..."
✅ NEW: "Keep sentences short and clear. Speak like a foreman with experience."

---

### 11. **Emphasized Critical Steps**
Added "This step is important" to critical instructions:
- ZIP code requirement
- Never inventing data
- Error handling

**Why:** Models prioritize emphasized instructions in complex prompts.

---

### 12. **Guardrails Section**
**NEW:** Dedicated `# Guardrails` section with all non-negotiable rules

**Rules:**
- Never invent materials or prices
- Never manipulate website directly
- Never skip ZIP code requirement
- Never talk about technical implementation
- Never speak like a chatbot

**Why:** Models are tuned to pay extra attention to `# Guardrails` heading.

---

## Before vs After Comparison

### Structure
| Aspect | Before | After |
|--------|--------|-------|
| Sections | 3 mixed sections | 9 clean sections |
| Tool count | 12 (incorrect) | 9 (correct) |
| Tool architecture | Mixed up | Correct categorization |
| Character normalization | None | Dedicated section |
| Error handling | None | Every tool |
| Examples | None | 2 complete workflows |
| Material IDs | Not documented | Full reference table |

### Tool Documentation
| Tool | Before | After |
|------|--------|-------|
| check_service_area | Not mentioned | Full docs + usage |
| get_materials_by_zip | Mentioned | Full docs + usage |
| get_material_details | Mentioned | Full docs + Material ID table |
| calculate_quantity | Wrong category | Correct + formula |
| create_or_update_cart | Wrong name | Correct + JSON example |
| prefill_checkout_form | Wrong category | Correct + normalization |
| navigate_to | Basic mention | Full docs |
| get_session_state | Basic mention | Full docs |
| update_session_state | Basic mention | Full docs |

---

## ElevenLabs Best Practices Applied

✅ **Separate instructions into clean sections**
✅ **Be as concise as possible**
✅ **Emphasize critical instructions**
✅ **Normalize inputs and outputs**
✅ **Provide clear examples**
✅ **Dedicate a guardrails section**
✅ **Describe tools precisely with detailed parameters**
✅ **Explain when and how to use each tool**
✅ **Use character normalization for tool inputs**
✅ **Handle tool call failures gracefully**

---

## Migration Checklist

To deploy the new prompt:

- [ ] Copy `ROBERT_SYSTEM_PROMPT.md` content to ElevenLabs agent settings
- [ ] Verify all 9 tools are configured in ElevenLabs
- [ ] Ensure webhook URL is correct: `https://milestone-trucks-chat.vercel.app/api/elevenlabs/webhook`
- [ ] Test ZIP code validation flow
- [ ] Test material lookup flow
- [ ] Test quantity calculation
- [ ] Test cart creation
- [ ] Test checkout navigation
- [ ] Verify error handling works for each tool
- [ ] Test out-of-area ZIP handling

---

## Critical Fix: Out-of-Area ZIP Policy

**Question to resolve:** What should Robert say when ZIP is NOT in the 7,802 serviced ZIPs?

**Current approach in new prompt:**
> "That ZIP is outside our standard delivery area. Let me note your request and someone from our team will reach out to discuss options."

**Alternatives:**
1. Hard refusal: "Sorry, we can't deliver there."
2. Lead capture: "We don't currently deliver there, but I can have someone reach out to discuss options."
3. Manual follow-up: Current approach (recommended)

**Recommendation:** Keep current approach. It's professional, doesn't make promises, and creates a lead for manual follow-up.

---

## Next Steps

1. Review new prompt for accuracy
2. Clarify out-of-area ZIP policy if needed
3. Deploy to ElevenLabs staging environment
4. Test all 9 tools
5. Run through both example workflows
6. Monitor first 10-20 conversations for issues
7. Iterate based on real usage

---

*Created: December 2024*
*Agent: Robert v2.0*
*Platform: ElevenLabs*
