'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)


export async function submitAssignment(
  studentId,
  studentName,
  rollNo,
  subject,
  assignmentName
) {
  try {
    const { data: lastSubmission } = await supabase
      .from('submissions')
      .select('priority')
      .order('priority', { ascending: false })
      .limit(1)
      .single()

    const nextPriority = lastSubmission?.priority ? lastSubmission.priority + 1 : 1

    const { data, error } = await supabase
      .from('submissions')
      .insert([
        {
          student_id: studentId,
          student_name: studentName,
          roll_no: rollNo,
          subject,
          assignment_name: assignmentName,
          priority: nextPriority,
        },
      ])
      .select()
      .single()

    if (error) throw error
    revalidatePath('/student')
    return { success: true, data }
  } catch (error) {
    return { error: error.message }
  }
}

export async function getSubmissions() {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('priority', { ascending: true })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    return { error: error.message, data: [] }
  }
}


export async function getStudentSubmissions(studentId) {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    return { error: error.message, data: [] }
  }
}

export async function checkAssignment(submissionId) {
  try {
    const { error } = await supabase
      .from('submissions')
      .update({ is_checked: true })
      .eq('id', submissionId)

    if (error) throw error
    revalidatePath('/teacher')
    revalidatePath('/student')
    return { success: true }
  } catch (error) {
    return { error: error.message }
  }
}

export async function addNote(submissionId, note) {
  try {
    const { error } = await supabase
      .from('submissions')
      .update({ note })
      .eq('id', submissionId)

    if (error) throw error
    revalidatePath('/teacher')
    revalidatePath('/student')
    return { success: true }
  } catch (error) {
    return { error: error.message }
  }
}

export async function deleteSubmission(submissionId) {
  try {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', submissionId)

    if (error) throw error
    revalidatePath('/teacher')
    revalidatePath('/student')
    return { success: true }
  } catch (error) {
    return { error: error.message }
  }
}
