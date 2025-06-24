import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMeetings } from "@/hooks/useMeetings";
import { useProjects } from "@/hooks/useProjects";
import { Meeting } from "@/types";
import { Plus, Edit, Trash2, Clock, Users, Calendar, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function MeetingsManager() {
  const { meetings, loading, createMeeting, updateMeeting, deleteMeeting } = useMeetings();
  const { projects } = useProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    date: '',
    time: '',
    duration: '',
    status: 'Upcoming' as Meeting['status'],
    minutes: '',
    participants: ''
  });

  const resetForm = () => {
    setFormData({
      projectId: '',
      title: '',
      date: '',
      time: '',
      duration: '',
      status: 'Upcoming',
      minutes: '',
      participants: ''
    });
    setEditingMeeting(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const meetingData = {
      ...formData,
      duration: parseInt(formData.duration),
      participants: formData.participants.split(',').map(p => p.trim()).filter(p => p)
    };
    if (editingMeeting) {
      await updateMeeting(editingMeeting.id, meetingData);
    } else {
      await createMeeting(meetingData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      projectId: meeting.projectId,
      title: meeting.title,
      date: meeting.date,
      time: meeting.time,
      duration: meeting.duration.toString(),
      status: meeting.status,
      minutes: meeting.minutes || '',
      participants: meeting.participants.join(', ')
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteMeeting(id);
  };

  const markAsCompleted = async (id: string) => {
    await updateMeeting(id, { status: 'Completed' });
  };

  const upcomingMeetings = meetings.filter(m => m.status === 'Upcoming');
  const completedMeetings = meetings.filter(m => m.status === 'Completed');

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600">Schedule and track project meetings.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMeeting ? 'Edit Meeting' : 'Schedule New Meeting'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectId">Project</Label>
                <Select value={formData.projectId} onValueChange={(value) => setFormData({...formData, projectId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name} - {project.client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Project Kickoff, Weekly Review"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="60"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="participants">Participants (comma separated)</Label>
                <Input
                  id="participants"
                  value={formData.participants}
                  onChange={(e) => setFormData({...formData, participants: e.target.value})}
                  placeholder="John Doe, Jane Smith, Client Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as Meeting['status']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.status === 'Completed' && (
                <div className="space-y-2">
                  <Label htmlFor="minutes">Meeting Minutes</Label>
                  <Textarea
                    id="minutes"
                    value={formData.minutes}
                    onChange={(e) => setFormData({...formData, minutes: e.target.value})}
                    rows={4}
                    placeholder="Meeting summary, decisions made, action items..."
                  />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMeeting ? 'Update' : 'Schedule'} Meeting
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Upcoming Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{upcomingMeetings.length}</div>
            <p className="text-xs text-blue-600">Scheduled meetings</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Completed Meetings</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{completedMeetings.length}</div>
            <p className="text-xs text-green-600">Total meetings held</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Meetings */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Clock className="w-5 h-5" />
            Upcoming Meetings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingMeetings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming meetings scheduled</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meeting</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingMeetings.map((meeting) => {
                  const project = projects.find(p => p.id === meeting.projectId);
                  return (
                    <TableRow key={meeting.id} className="hover:bg-blue-50">
                      <TableCell className="font-medium">{meeting.title}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{project?.name}</p>
                          <p className="text-sm text-gray-500">{project?.client}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{new Date(meeting.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{meeting.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {meeting.duration}m
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{meeting.participants.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsCompleted(meeting.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(meeting)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(meeting.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Completed Meetings */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            Completed Meetings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedMeetings.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No completed meetings yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedMeetings.map((meeting) => {
                const project = projects.find(p => p.id === meeting.projectId);
                return (
                  <div key={meeting.id} className="border rounded-lg p-4 bg-green-50 hover:bg-green-100 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-lg">{meeting.title}</h4>
                        <p className="text-sm text-gray-600">{project?.name} - {project?.client}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>{new Date(meeting.date).toLocaleDateString()} at {meeting.time}</span>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {meeting.duration} min
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {meeting.participants.length} participants
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(meeting)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(meeting.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {meeting.minutes && (
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm font-medium mb-1">Meeting Minutes:</p>
                        <p className="text-sm text-gray-700">{meeting.minutes}</p>
                      </div>
                    )}
                    {meeting.participants.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1">Participants:</p>
                        <div className="flex flex-wrap gap-1">
                          {meeting.participants.map((participant, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {participant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
